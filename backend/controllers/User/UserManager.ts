import { UserHandler } from "../../handlers/UserHandler";
import { UserUtil } from "../../utilities/UserUtil";
import { AuthRequest } from "../../types";

interface User {
    id: number,
    email: string,
    name: string,
    password: string,
    role: string,
    number: string
}

interface UpdateProfile {
    number: string
}

export class UserManager {
    static async profile(req: AuthRequest): Promise<User> {
        const data = req.user;
        const id = data.id;
        const user = await UserHandler.FindUserById(id)
        UserUtil.UserExistCheck(user);
        return user;
    }

    static async updateProfile(req: AuthRequest) {
        const updateData: UpdateProfile = req.body;

        const id = req.user.id;
        UserUtil.UpdateProfileCheck(updateData);
        const user = await UserHandler.updateProfile(updateData, id);
        UserUtil.UserExistCheck(user);
        return user[1][0];
    }
}