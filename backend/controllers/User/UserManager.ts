import { UserHandler } from "../../handlers/UserHandler";
import { UserUtil } from "../../utilities/UserUtil";
import { AuthRequest } from "../../types";
import { updateProfile, user } from "../../interface/User";


export class UserManager {
    static async getProfile(req: AuthRequest): Promise<user> {
        const data = req.user;
        const id = data.id;
        const user = await UserHandler.findUserById(id)
        UserUtil.userExistCheck(user);
        return user;
    }

    static async updateProfile(req: AuthRequest) {
        const updateData: updateProfile = req.body;

        const id = req.user.id;
        UserUtil.updateProfileCheck(updateData);
        const user = await UserHandler.updateProfile(updateData, id);
        UserUtil.userExistCheck(user);
        return user[1][0];
    }
}