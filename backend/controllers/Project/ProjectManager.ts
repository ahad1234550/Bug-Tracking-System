import { Model } from "sequelize";
import { ProjectHandler } from "../../handlers/ProjectHandler";
import { AuthRequest } from "../../types";
import { ProjectUtil } from "../../utilities/ProjectUtil";
import { Exception } from "../../helpers";
import { User } from "../../constants/User";
import { ErrorCodes } from "../../constants";
import { UserHandler } from "../../handlers/UserHandler";
import { DeleteFile } from "../../middlewares/DeleteFile";
import { BugHandler } from "../../handlers/BugHandler";

interface Project extends Model {
    id: number;
    name: string;
    description: string;
    logo: string;
    manager_id: number;
}

interface ProjectQA extends Model {
    id: number,
    project_id: number,
    qa_id: number
}

interface ProjectDeveloper extends Model {
    id: number,
    project_id: number,
    developer_id: number
}

interface User extends Model {
    id: number,
    email: string,
    name: string,
    password: string,
    role: string,
    number: string
}


export class ProjectManager {
    static async addProject(req: AuthRequest): Promise<{ project: Project, QA: ProjectQA[], Developer: ProjectDeveloper[] }> {

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

        const DeveloperStrings = Array.isArray(data.Developer) ? data.Developer : [data.Developer];

        const Developer = await Promise.all(
            DeveloperStrings.map((developer_id: string) => ProjectHandler.addDeveloperForProject(project.id, parseInt(developer_id, 10)))
        );

        return { project, QA, Developer };

    }

    static async editProject(req: AuthRequest): Promise<{ project: Project, QA: ProjectQA[], Developer: ProjectDeveloper[] }> {
        console.log("file:", req.file);
        const user = req.user;

        ProjectUtil.isAllowedForProject(user.role);

        const data = req.body;

        const project_id = parseInt(data.project_id as string, 10);

        const projectCheck = await ProjectHandler.FindProjectByIdAndManager(project_id, user.id);

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

        const project = await ProjectHandler.updateProject(data.name, data.description, pathname, project_id);

        console.log("project", project);

        await ProjectHandler.deleteQAProject(project_id);

        await ProjectHandler.deleteDeveloperProject(project_id);

        const QAStrings = Array.isArray(data.QA) ? data.QA : [data.QA];

        const QA = await Promise.all(
            QAStrings.map((qa_id: string) => ProjectHandler.addQAForProject(project_id, parseInt(qa_id, 10)))
        );

        const DeveloperStrings = Array.isArray(data.Developer) ? data.Developer : [data.Developer];

        const Developer = await Promise.all(
            DeveloperStrings.map((developer_id: string) => ProjectHandler.addDeveloperForProject(project_id, parseInt(developer_id, 10)))
        );

        return { project, QA, Developer };

    }

    static async deleteProject(req: AuthRequest): Promise<Project> {

        const user = req.user;

        console.log("user: ",user);

        ProjectUtil.isAllowedForProject(user.role);

        const data = req.body;

        console.log("data: ",data);

        const project_id = data.project_id;

        console.log("project_id: ",project_id);

        const projectCheck = await ProjectHandler.FindProjectByIdAndManager(project_id, user.id);

        console.log("project: ",projectCheck);

        if (!projectCheck) {
            console.log("Project ID not found");
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        }

        await BugHandler.deleteBugByProjectId(project_id);

        await ProjectHandler.deleteQAProject(project_id);

        await ProjectHandler.deleteDeveloperProject(project_id);

        await ProjectHandler.deleteProjectById(project_id, user.id);

        const fileName = projectCheck.logo;
        DeleteFile.delete(fileName.replace("uploads/", ""));

        return projectCheck;

    }

    static async readProjects(req: AuthRequest): Promise<Project[] | null> {
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
            const project_ids = await ProjectHandler.readQAProjects(id);
            if (!project_ids.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            const ids = project_ids.map(p => p.project_id);

            const projects = await ProjectHandler.FindProjectByIds(ids)

            if (!projects.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            return projects;
        }
        else {
            const project_ids = await ProjectHandler.readDeveloperProjects(id);
            if (!project_ids.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            const ids = project_ids.map(p => p.project_id);

            const projects = await ProjectHandler.FindProjectByIds(ids)

            if (!projects.length) {
                console.log("No project found for your QA role. ID:", id);
                throw new Exception(User.MESSAGES.NO_PROJECT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }

            return projects;
        }
    }

    static async getAllAssociatedQA(req: AuthRequest): Promise<User[] | null> {
        const project_id = parseInt(req.query.project as string, 10);

        const qaRows = await ProjectHandler.getAllQAForProject(project_id);
        const qaIds = qaRows.map((q: any) => q.qa_id);

        if (qaIds.length === 0) {
            console.log("No QA found for this project");
            throw new Exception(
                User.MESSAGES.INVALID_QA_ID,
                ErrorCodes.DOCUMENT_NOT_FOUND,
                { resultError: true }
            ).toJson();
        }

        const users = await UserHandler.FindQARoleUser(qaIds);

        return users;
    }

    static async getAllAssociatedDeveloper(req: AuthRequest): Promise<User[] | null> {
        const project_id = parseInt(req.query.project as string, 10);

        const developerRows = await ProjectHandler.getAllDeveloperForProject(project_id);
        const developerIds = developerRows.map((d: any) => d.developer_id);

        if (developerIds.length === 0) {
            console.log("No QA found for this project");
            throw new Exception(
                User.MESSAGES.INVALID_Developer_ID,
                ErrorCodes.DOCUMENT_NOT_FOUND,
                { resultError: true }
            ).toJson();
        }

        const users = await UserHandler.FindDeveloperRoleUser(developerIds);

        return users;
    }




}