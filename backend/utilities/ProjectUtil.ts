import path from "path";
import { ErrorCodes, UserConstants } from "../constants";
import { Exception, Validators } from "../helpers";
import { User } from "../constants/User";
import { UserHandler } from "../handlers/UserHandler";
import { addProduct } from "../interface/Project";


const allowedExtensions = ["png", "gif"];

export class ProjectUtil {
    static isAllowedForProject(role: "manager" | "qa" | "developer" | string): void {
        if (role !== "manager") {
            console.log("You cannot perform this operation. Role UnAutorized");
            throw new Exception(UserConstants.MESSAGES.ROLE_UNAUTORIZED, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
        }
    }

    static async checkData(data: addProduct): Promise<void> {
        if (!data || !data.description || !data.name || !data.QA || !data.developer) {
            console.log("Data is missing");
            throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_ADD_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        const QAStrings = Array.isArray(data.QA) ? data.QA : [data.QA];

        for (const id of QAStrings) {
            const intId = parseInt(id, 10);
            if (Validators.isNaN(intId)) {
                console.log('Invalid QA ID');
                throw new Exception(User.MESSAGES.INVALID_QA_ID, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
            }
            console.log("ID:", intId);
            const role = await UserHandler.findUserRoleById(intId);
            if (role !== "qa") {
                console.log('Invalid QA');
                throw new Exception(User.MESSAGES.INVALID_QA_ROLE, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
            }
            console.log("ID:", intId);
        }

        const developerStrings = Array.isArray(data.developer) ? data.developer : [data.developer];

        for (const id of developerStrings) {
            const intId = parseInt(id, 10);
            if (Validators.isNaN(intId)) {
                console.log('Invalid Developer ID');
                throw new Exception(User.MESSAGES.INVALID_Developer_ID, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
            }
            console.log("ID:", intId);
            const role = await UserHandler.findUserRoleById(intId);
            if (role !== "developer") {
                console.log('Invalid Developer');
                throw new Exception(User.MESSAGES.INVALID_Developer_ROLE, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
            }
            console.log("ID:", intId);
        }
    }
    // static async checkDataEdit(data: addProduct): Promise<void> {
    //     if (!data || !data.description || !data.name || !data.QA || !data.Developer) {
    //         console.log("Data is missing");
    //         throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_ADD_PROJECT, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
    //     }

    //     const QAStrings = Array.isArray(data.QA) ? data.QA : [data.QA];

    //     for (const id of QAStrings) {
    //         const intId = parseInt(id, 10);
    //         if (Validators.isNaN(intId)) {
    //             console.log('Invalid QA ID');
    //             throw new Exception(User.MESSAGES.INVALID_QA_ID, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
    //         }
    //         console.log("ID:", intId);
    //         const role = await UserHandler.FindUserRoleById(intId);
    //         if (role !== "qa") {
    //             console.log('Invalid QA');
    //             throw new Exception(User.MESSAGES.INVALID_QA_ROLE, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
    //         }
    //         console.log("ID:", intId);
    //     }

    //     const DeveloperStrings = Array.isArray(data.Developer) ? data.Developer : [data.Developer];

    //     for (const id of DeveloperStrings) {
    //         const intId = parseInt(id, 10);
    //         if (Validators.isNaN(intId)) {
    //             console.log('Invalid Developer ID');
    //             throw new Exception(User.MESSAGES.INVALID_Developer_ID, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
    //         }
    //         console.log("ID:", intId);
    //         const role = await UserHandler.FindUserRoleById(intId);
    //         if (role !== "developer") {
    //             console.log('Invalid Developer');
    //             throw new Exception(User.MESSAGES.INVALID_Developer_ROLE, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
    //         }
    //         console.log("ID:", intId);
    //     }
    // }


    static checkImageType(file: string): boolean {
        const ext = path.extname(file).toLocaleLowerCase().slice(1);
        if (!allowedExtensions.includes(ext)) {
            return false;
        }
        return true;
    }
}