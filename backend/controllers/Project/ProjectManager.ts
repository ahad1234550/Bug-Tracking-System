import { ProjectHandler } from "../../handlers/ProjectHandler";
import { AuthRequest } from "../../types";
import { ProjectUtil } from "../../utilities/ProjectUtil";
import { Exception } from "../../helpers";
import { User } from "../../constants/User";
import { ErrorCodes } from "../../constants";
import { UserHandler } from "../../handlers/UserHandler";
import { DeleteFile } from "../../middlewares/DeleteFile";
import { BugHandler } from "../../handlers/BugHandler";
import { project, projectDeveloper, projectQA } from "../../interface/Project";
import { user } from "../../interface/User";



export class ProjectManager {
    static async addProject(req: AuthRequest): Promise<{ project: project, QA: projectQA[], developer: projectDeveloper[] }> {

        if (!req.file) {
            console.log("File not found");
            throw new Exception(User.MESSAGES.FILE_REQUIRED, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        }
        console.log("file:", req.file);
        const user = req.user;

        ProjectUtil.isAllowedForProject(user.role);

        const data = req.body;

        await ProjectUtil.checkData(data);

        const manager_id = user.id;

        const pathname = `uploads/${req.file?.filename}`;

        console.log("path", pathname);

        const project = await ProjectHandler.addProject(data.name, data.description, pathname, manager_id);

        console.log("project", project);

        const QAStrings = Array.isArray(data.QA) ? data.QA : [data.QA];

        const QA = await Promise.all(
            QAStrings.map((qa_id: string) => ProjectHandler.addQAForProject(project.id, parseInt(qa_id, 10)))
        );

        const developerStrings = Array.isArray(data.developer) ? data.developer : [data.developer];

        const developer = await Promise.all(
            developerStrings.map((developer_id: string) => ProjectHandler.addDeveloperForProject(project.id, parseInt(developer_id, 10)))
        );

        return { project, QA, developer };

    }

    static async editProject(req: AuthRequest): Promise<{ project: project, QA: projectQA[], developer: projectDeveloper[] }> {
        console.log("file:", req.file);
        const user = req.user;

        ProjectUtil.isAllowedForProject(user.role);

        const data = req.body;

        const projectId = parseInt(req.params.projectId as string, 10);

        const projectCheck = await ProjectHandler.findProjectByIdAndManager(projectId, user.id);

        if (!projectCheck) {
            console.log("Project ID not found");
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        }

        await ProjectUtil.checkData(data);

        let pathname = projectCheck.logo;

        if (req.file) {
            const fileName = projectCheck.logo;
            DeleteFile.delete(fileName.replace("uploads/", ""));
            pathname = `uploads/${req.file?.filename}`;
        }

        console.log("path", pathname);

        const project = await ProjectHandler.updateProject(data.name, data.description, pathname, projectId);

        console.log("project", project);

        await ProjectHandler.deleteQAProject(projectId);

        await ProjectHandler.deleteDeveloperProject(projectId);

        const QAStrings = Array.isArray(data.QA) ? data.QA : [data.QA];

        const QA = await Promise.all(
            QAStrings.map((qa_id: string) => ProjectHandler.addQAForProject(projectId, parseInt(qa_id, 10)))
        );

        const developerStrings = Array.isArray(data.developer) ? data.developer : [data.developer];

        const developer = await Promise.all(
            developerStrings.map((developer_id: string) => ProjectHandler.addDeveloperForProject(projectId, parseInt(developer_id, 10)))
        );

        return { project, QA, developer };

    }

    static async deleteProject(req: AuthRequest): Promise<project> {

        const user = req.user;

        console.log("user: ",user);

        ProjectUtil.isAllowedForProject(user.role);

        const projectId = parseInt(req.params.projectId,10);

        console.log("projectId: ",projectId);

        const projectCheck = await ProjectHandler.findProjectByIdAndManager(projectId, user.id);

        console.log("project: ",projectCheck);

        if (!projectCheck) {
            console.log("Project ID not found");
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        }

        await BugHandler.deleteBugByProjectId(projectId);

        await ProjectHandler.deleteQAProject(projectId);

        await ProjectHandler.deleteDeveloperProject(projectId);

        await ProjectHandler.deleteProjectById(projectId, user.id);

        const fileName = projectCheck.logo;
        DeleteFile.delete(fileName.replace("uploads/", ""));

        return projectCheck;

    }

    static async readProjects(req: AuthRequest): Promise<project[] | null> {
        const role = req.user.role;

        const id = req.user.id;

        if (role === "manager") {
            const projects = await ProjectHandler.readManagerProjects(id);
            if (!projects.length) {
                console.log("No project found for your manager role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }
            return projects;

        }
        else if (role === "qa") {
            const projectId = await ProjectHandler.readQAProjects(id);
            if (!projectId.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            const ids = projectId.map(p => p.project_id);

            const projects = await ProjectHandler.findProjectByIds(ids)

            if (!projects.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            return projects;
        }
        else {
            const projectIds = await ProjectHandler.readDeveloperProjects(id);
            if (!projectIds.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            const ids = projectIds.map(p => p.project_id);

            const projects = await ProjectHandler.findProjectByIds(ids)

            if (!projects.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            return projects;
        }
    }

    static async getAllAssociatedQA(req: AuthRequest): Promise<user[] | null> {
        const projectId = parseInt(req.params.projectId as string, 10);

        const qaRows = await ProjectHandler.getAllQAForProject(projectId);
        const qaIds = qaRows.map((q: any) => q.qa_id);

        if (qaIds.length === 0) {
            console.log("No QA found for this project");
            throw new Exception(
                User.MESSAGES.INVALID_QA_ID,
                ErrorCodes.DOCUMENT_NOT_FOUND,
                { resultError: true }
            ).toJson();
        }

        const users = await UserHandler.findQARoleUser(qaIds);

        return users;
    }

    static async getAllAssociatedDeveloper(req: AuthRequest): Promise<user[] | null> {
        const projectId = parseInt(req.params.projectId as string, 10);

        const developerRows = await ProjectHandler.getAllDeveloperForProject(projectId);
        const developerIds = developerRows.map((d:  any) => d.developer_id);

        if (developerIds.length === 0) {
            console.log("No QA found for this project");
            throw new Exception(
                User.MESSAGES.INVALID_Developer_ID,
                ErrorCodes.DOCUMENT_NOT_FOUND,
                { resultError: true }
            ).toJson();
        }

        const users = await UserHandler.findDeveloperRoleUser(developerIds);

        return users;
    }




}