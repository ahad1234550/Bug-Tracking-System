import { ErrorCodes, UserConstants } from "../constants";
import { User } from "../constants/User";
import { BugHandler } from "../handlers/BugHandler";
import { ProjectHandler } from "../handlers/ProjectHandler";
import { Exception } from "../helpers";
import path from "path";
import { addBug } from "../interface/Bug";

const allowedExtensions = ["png", "gif"];

export class BugUtil {
    static isAllowedForBug(role: "manager" | "qa" | "developer" | string): void {
        if (role !== "qa") {
            console.log("You cannot perform this operation. Role UnAutorized");
            throw new Exception(UserConstants.MESSAGES.ROLE_UNAUTORIZED, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
        }
    }

    static async checkData(data: addBug, filename: string): Promise<void> {
        if (!data || !filename || !data.title || !data.description || !data.deadline || !data.type || !data.status || (isNaN(parseInt(data.project_id, 10))) || (isNaN(parseInt(data.developer_id, 10)))) {
            console.log("Data is missing");
            throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_ADD_BUG, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        const project = await ProjectHandler.findProjectById(parseInt(data.project_id, 10));
        if (!project) {
            console.log('Invalid Project');
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
        }

        const developer = await ProjectHandler.developer_Exist_For_Project(parseInt(data.project_id, 10), parseInt(data.developer_id, 10));
        if (!developer) {
            console.log('Invalid Developer');
            throw new Exception(User.MESSAGES.INVALID_Developer_ID, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
        }
    }

    static checkImageType(file: string): boolean {
        const ext = path.extname(file).toLocaleLowerCase().slice(1);
        if (!allowedExtensions.includes(ext)) {
            return false;
        }
        return true;
    }

    static async checkProjectExist(projectId: string): Promise<void> {
        if (isNaN(parseInt(projectId, 10))) {
            console.log("Wrong project id or NAN!");
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        }

        const project = await ProjectHandler.findProjectById(parseInt(projectId, 10));
        if (!project) {
            console.log("Project not found for ID: ", projectId);
            throw new Exception(User.MESSAGES.INVALID_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
        }
    }

    static async checkStatusChangeData(status: string, bug_id: string, role: string, id: number): Promise<void> {
        if (isNaN(parseInt(bug_id, 10)) || !status) {
            console.log("Data is missing!");
            throw new Exception(User.MESSAGES.INVALID_DATA_TO_CHANGE_BUG_STATUS, ErrorCodes.BAD_REQUEST, { resultError: true }).toJson();
        }

        if (status !== "new" && status !== "started" && status !== "resolved" && status !== "completed") {
            console.log("Invalid Status!");
            throw new Exception(User.MESSAGES.INVALID_DATA_TO_CHANGE_BUG_STATUS, ErrorCodes.BAD_REQUEST, { resultError: true }).toJson();
        }


        const id_bug = parseInt(bug_id, 10);

        const bug = await BugHandler.findBugById(id_bug);

        if (!bug) {
            console.log("Invalid bug Id!");
            throw new Exception(User.MESSAGES.INVALID_DATA_TO_CHANGE_BUG_STATUS, ErrorCodes.BAD_REQUEST, { resultError: true }).toJson();
        }

        if (role === "qa") {
            const existQa = await BugHandler.findQABug(id, id_bug);
            if (!existQa) {
                console.log("You are not assigned this bug!");
                throw new Exception(User.MESSAGES.BUG_NOT_ASSIGNED, ErrorCodes.UNAUTHORIZED, { resultError: true }).toJson();
            }
        }
        if (role === "developer") {
            const existDeveloper = await BugHandler.findDeveloperBug(id, id_bug);
            if (!existDeveloper) {
                console.log("You are not assigned this bug!");
                throw new Exception(User.MESSAGES.BUG_NOT_ASSIGNED, ErrorCodes.UNAUTHORIZED, { resultError: true }).toJson();
            }
        }
    }
}