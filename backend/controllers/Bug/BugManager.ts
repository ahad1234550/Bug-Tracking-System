import { Model } from "sequelize";
import { BugHandler } from "../../handlers/BugHandler";
import { AuthRequest } from "../../types";
import { BugUtil } from "../../utilities/BugUtil";
import { Exception } from "../../helpers";
import { User } from "../../constants/User";
import { ErrorCodes } from "../../constants";

interface bug extends Model {
    id: number,
    title: string,
    description: string,
    deadline: Date,
    screenshot: string,
    type: "feature" | "bug",
    status: "new" | "started" | "completed" | "resolved",
    project_id: number,
    qa_id: number,
    developer_id: number
}



export class BugManager {
    static async addBug(req: AuthRequest): Promise<{ bug: bug }> {
        console.log("file:", req.file);
        const user = req.user;

        BugUtil.isAllowedForBug(user.role);

        const data = req.body;

        await BugUtil.checkData(data, req.file?.filename);

        const qa_id = user.id;

        const pathname = `uploads/${req.file?.filename}`;

        console.log("path", pathname);

        const bug: bug = await BugHandler.addBug(data.title, data.description, data.deadline, data.type, data.status, parseInt(data.project_id, 10), qa_id, pathname, parseInt(data.developer_id,10));

        console.log("Bug: ", bug);

        return { bug }
    }

    static async readBug(req: AuthRequest): Promise<bug[]> {

        let project_id: string | number | null = req.query.project as string;

        if (!project_id) {
            throw new Exception(
                User.MESSAGES.INVALID_PROJECT,
                ErrorCodes.BAD_REQUEST,
                { reportError: true }
            );
        }

        await BugUtil.checkProjectExist(project_id);

        project_id = parseInt(project_id, 10);

        const role = req.user.role;
        const id = req.user.id;

        let bugs: bug[];

        if (role === "manager") {
            bugs = await BugHandler.getManagerBug(project_id);
            if (!bugs.length) {
                console.log("No bug found for manager. project ID: ", project_id)
                throw new Exception(User.MESSAGES.BUG_NOT_FOUND_FOR_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }
        }
        else if (role === "qa") {
            bugs = await BugHandler.getQABug(id, project_id);
            if (!bugs.length) {
                console.log("No bug found for QA. project ID: ", project_id)
                throw new Exception(User.MESSAGES.BUG_NOT_FOUND_FOR_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }
        }
        else {
            bugs = await BugHandler.getDeveloperBug(id, project_id);
            if (!bugs.length) {
                console.log("No bug found for Developer. project ID: ", project_id)
                throw new Exception(User.MESSAGES.BUG_NOT_FOUND_FOR_PROJECT, ErrorCodes.DOCUMENT_NOT_FOUND, { resultError: true }).toJson();
            }
        }

        return bugs;

    }

    static async changeBugStatus(req: AuthRequest){

        const user = req.user;

        const status = req.query.status as string;
        const bug_id = req.query.bug as string;

        await BugUtil.checkStatusChangeData(status, bug_id, user.role, user.id);

        const bug = await BugHandler.changeStatus(parseInt(bug_id,10), status);

        return bug;
    }
}