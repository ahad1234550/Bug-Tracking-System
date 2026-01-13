import { BugHandler } from "../../handlers/BugHandler";
import { AuthRequest } from "../../types";
import { BugUtil } from "../../utilities/BugUtil";
import { Exception } from "../../helpers";
import { User } from "../../constants/User";
import { ErrorCodes } from "../../constants";
import { bug } from "../../interface/Bug";




export class BugManager {
    static async addBug(req: AuthRequest): Promise<{ bug: bug }> {
        console.log("file:", req.file);
        const user = req.user;

        const data = req.body;

        await BugUtil.checkData(data, req.file?.filename);

        const qaId = user.id;

        const pathname = `uploads/${req.file?.filename}`;

        console.log("path", pathname);

        const bug: bug = await BugHandler.addBug(data.title, data.description, data.deadline, data.type, data.status, parseInt(data.project_id, 10), qaId, pathname, parseInt(data.developer_id,10));

        console.log("Bug: ", bug);

        return { bug }
    }

    static async readBug(req: AuthRequest): Promise<{bugs:bug[], role: "manager" | "qa" | "developer"}> {

        console.log(req.params.projectId);

        let projectId: string | number = req.params.projectId as string;

        console.log("Project: ", projectId)

        if (!projectId) {
            throw new Exception(
                User.MESSAGES.INVALID_PROJECT,
                ErrorCodes.BAD_REQUEST,
                { reportError: true }
            );
        }

        await BugUtil.checkProjectExist(projectId);

        const search = req.query.search as string;

        projectId = parseInt(projectId, 10);

        const role = req.user.role;
        const id = req.user.id;

        let bugs: bug[];

        if (role === "manager") {
            bugs = await BugHandler.getManagerBug(projectId, search);
        }
        else if (role === "qa") {
            bugs = await BugHandler.getQABug(id, projectId, search);
        }
        else {
            bugs = await BugHandler.getDeveloperBug(id, projectId, search);
        }

        return {bugs, role};

    }

    static async changeBugStatus(req: AuthRequest): Promise<bug>{

        const user = req.user;

        const data = req.body;

        const status = data.status as string;
        const bug_id = req.params.bugId as string;

        await BugUtil.checkStatusChangeData(status, bug_id, user.role, user.id);

        const bugs = await BugHandler.changeStatus(parseInt(bug_id,10), status);

        return bugs;
    }

    static async deleteBug(req: AuthRequest): Promise<bug> {
        const bugId = req.params.bugId;
        if(isNaN(parseInt(bugId, 10))){
            throw new Exception(User.MESSAGES.BUG_NOT_FOUND,ErrorCodes.BAD_REQUEST,{resultError: true}).toJson();
        }
        const bug = await BugHandler.findBugById(parseInt(bugId, 10));

        if(!bug){
            throw new Exception(User.MESSAGES.BUG_NOT_FOUND,ErrorCodes.DOCUMENT_NOT_FOUND,{resultError: true}).toJson();
        }

        await BugHandler.deleteBugById(parseInt(bugId, 10));

        return bug;
    }
}