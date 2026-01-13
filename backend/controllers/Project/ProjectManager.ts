import { ProjectHandler } from "../../handlers/ProjectHandler";
import { AuthRequest } from "../../types";
import { ProjectUtil } from "../../utilities/ProjectUtil";
import { Exception } from "../../helpers";
import { User } from "../../constants/User";
import { ErrorCodes } from "../../constants";
import { UserHandler } from "../../handlers/UserHandler";
import { DeleteFile } from "../../middlewares/DeleteFile";
import { BugHandler } from "../../handlers/BugHandler";
import { project, projectDeveloper, projectQA, projectUser } from "../../interface/Project";
import { idName, user } from "../../interface/User";


interface EditProjectData {
    projectId: number;
    name?: string;
    description?: string;
    logoFile?: Express.Multer.File;
    QA?: string[];        // array of QA user IDs
    developer?: string[]; // array of Developer user IDs
}

export class ProjectManager {
    static async addProject(
        req: AuthRequest
    ): Promise<{ project: project, projectUser: projectUser[] }> {

        if (!req.file) {
            throw new Exception(
                User.MESSAGES.FILE_REQUIRED,
                ErrorCodes.DOCUMENT_NOT_FOUND,
                { resultError: true }
            ).toJson();
        }

        const user = req.user;
        console.log(user);
        const data = req.body;

        console.log(req.body);

        await ProjectUtil.checkData(data);

        const pathname = `uploads/${req.file.filename}`;

        const project = await ProjectHandler.addProject(
            data.name,
            data.description,
            pathname,
        );

        const projectId = project.id;

        const managerId = user.id;

        const qaIds = Array.isArray(data.QA)
            ? data.QA.map((id: string) => parseInt(id, 10))
            : [parseInt(data.QA, 10)];

        const developerIds = Array.isArray(data.developer)
            ? data.developer.map((id: string) => parseInt(id, 10))
            : [parseInt(data.developer, 10)];

        const allUserIds = [
            managerId,
            ...qaIds,
            ...developerIds
        ];

        const projectUser = await Promise.all(
            allUserIds.map(userId =>
                ProjectHandler.addUserToProject(projectId, userId)
            )
        );

        return { project, projectUser };
    }

    static async readProjects(
        req: AuthRequest
    ): Promise<{ projects: project[] | null; role: string }> {

        const role = req.user.role;
        const id = req.user.id;

        const search = req.query.search as string;

        const projects = await ProjectHandler.readProjects(id, search);

        return { projects, role };
    }

    static async getAllQA(req: AuthRequest): Promise<idName[] | null> {
        const role = "qa";
        const qaRows = await UserHandler.findAll(role);

        if (qaRows.length === 0) {
            console.log("No QA found");
            throw new Exception(
                User.MESSAGES.INVALID_QA_ID,
                ErrorCodes.DOCUMENT_NOT_FOUND,
                { resultError: true }
            ).toJson();
        }

        return qaRows;
    }

    static async getAllDeveloper(req: AuthRequest): Promise<idName[] | null> {
        const role = "developer";
        const qaRows = await UserHandler.findAll(role);

        if (qaRows.length === 0) {
            console.log("No Developer found");
            throw new Exception(
                User.MESSAGES.INVALID_Developer_ID,
                ErrorCodes.DOCUMENT_NOT_FOUND,
                { resultError: true }
            ).toJson();
        }

        return qaRows;
    }

    static async editProject(req: AuthRequest): Promise<project> {
        const data = req.body;

        await ProjectUtil.checkData(data);

        const logoFile = req.file;

        const projectId = parseInt(req.params.projectId as string, 10);

        const project = await ProjectHandler.findProjectById(projectId);
        if (!project) throw new Error("Project not found");

        let logoPath = project.logo;
        console.log("LogoPath:", logoPath);
        if (logoFile) {
            logoPath = `uploads/${logoFile.filename}`;
            if (project.logo) {
                DeleteFile.delete(project.logo);
            }
        }

        const updatedProject = await ProjectHandler.updateProject(
            data.name,
            data.description,
            logoPath,
            projectId
        );

        const existingUsers = await ProjectHandler.findQADeveloperInfoFromProject(projectId);

        const existingQAIds = existingUsers
            .filter((u) => u.user.role === "qa")
            .map((u) => u.user_id);

        const existingDevIds = existingUsers
            .filter((u) => u.user.role === "developer")
            .map((u) => u.user_id);

        const newQAIds = Array.isArray(data.QA) ? data.QA.map((id: string) => parseInt(id, 10)) : [parseInt(data.QA, 10)];
        const newDevIds = Array.isArray(data.developer)
            ? data.developer.map((id: string) => parseInt(id, 10))
            : [parseInt(data.developer, 10)];

        const qaToAdd = newQAIds.filter((id) => !existingQAIds.includes(id));
        const qaToDelete = existingQAIds.filter((id) => !newQAIds.includes(id));

        const devToAdd = newDevIds.filter((id) => !existingDevIds.includes(id));
        const devToDelete = existingDevIds.filter((id) => !newDevIds.includes(id));

        const userIdsToDelete = [...qaToDelete, ...devToDelete];
        if (userIdsToDelete.length > 0) {
            await ProjectHandler.usersToDelete(projectId, userIdsToDelete);
        }

        const allUserIdsToAdd = [...qaToAdd, ...devToAdd];
        const projectUser = await Promise.all(
            allUserIdsToAdd.map((userId) => ProjectHandler.addUserToProject(projectId, userId))
        );

        return updatedProject;
    }





    // static async editProject(req: AuthRequest): Promise<{ project: project, qa: projectQA[], developer: projectDeveloper[] }> {
    //     console.log("file:", req.file);
    //     const user = req.user;

    //     const data = req.body;

    //     const projectId = parseInt(req.params.projectId as string, 10);

    //     const projectCheck = await ProjectHandler.findProjectByIdAndManager(projectId, user.id);

    //     if (!projectCheck) {
    //         console.log("Project ID not found");
    //         throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
    //     }

    //     await ProjectUtil.checkData(data);

    //     let pathname = projectCheck.logo;

    //     if (req.file) {
    //         const fileName = projectCheck.logo;
    //         DeleteFile.delete(fileName.replace("uploads/", ""));
    //         pathname = `uploads/${req.file?.filename}`;
    //     }

    //     console.log("path", pathname);

    //     const project = await ProjectHandler.updateProject(data.name, data.description, pathname, projectId);

    //     console.log("project", project);

    //     await ProjectHandler.deleteQAProject(projectId);

    //     await ProjectHandler.deleteDeveloperProject(projectId);

    //     const qaStrings = Array.isArray(data.QA) ? data.QA : [data.QA];

    //     const qa = await Promise.all(
    //         qaStrings.map((qaId: string) => ProjectHandler.addQAForProject(projectId, parseInt(qaId, 10)))
    //     );

    //     const developerStrings = Array.isArray(data.developer) ? data.developer : [data.developer];

    //     const developer = await Promise.all(
    //         developerStrings.map((developer_id: string) => ProjectHandler.addDeveloperForProject(projectId, parseInt(developer_id, 10)))
    //     );

    //     return { project, qa, developer };

    // }

    static async deleteProject(req: AuthRequest): Promise<project> {

        const user = req.user;

        console.log("user: ", user);

        const projectId = parseInt(req.params.projectId, 10);

        console.log("projectId: ", projectId);

        const projectCheck = await ProjectHandler.findProjectById(projectId);

        console.log("project: ", projectCheck);

        if (!projectCheck) {
            console.log("Project ID not found");
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        }

        await ProjectHandler.deleteProjectById(projectId);

        const fileName = projectCheck.logo;
        DeleteFile.delete(fileName.replace("uploads/", ""));

        return projectCheck;

    }


    static async getAllAssociatedQA(req: AuthRequest): Promise<user[] | null> {


        const projectId = parseInt(req.params.projectId as string, 10);

        const project = await ProjectHandler.findProjectById(projectId);
        if (!project) {
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        };

        const users = await ProjectHandler.getAllRolesRelatedForProject(projectId, "qa");


        return users;
    }


    static async getAllAssociatedDeveloper(req: AuthRequest): Promise<user[] | null> {
        const projectId = parseInt(req.params.projectId as string, 10);

        const project = await ProjectHandler.findProjectById(projectId);

        if (!project) {
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        };

        const users = await ProjectHandler.getAllRolesRelatedForProject(projectId, "developer");

        return users;
    }




}