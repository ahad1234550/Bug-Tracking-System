import { db } from "../helpers";
import { Model } from "sequelize";
const UserModel = db.User as any;

export interface IUser extends Model {
    id: number;
    name: string;
    email: string;
    password: string;
    number: string;
    role: "manager" | "qa" | "developer";
}

interface createUserParams {
    name: string,
    email: string,
    password: string,
    number: string,
    role: "manager" | "qa" | "developer"
}

interface UpdateProfile {
    number: string
}

export class UserHandler {
    static async FindUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({
            where: { email }
        })
    }

    static async SignUpUser({ name, email, password, number, role }: createUserParams): Promise<IUser> {
        return UserModel.create({
            email,
            name,
            password,
            role,
            number
        });
    }

    static async FindUserById(id: number): Promise<IUser | null> {
        return UserModel.findOne({
            where: { id }
        })
    }

    static async updateProfile(data: UpdateProfile, id: number): Promise<IUser | null> {
        console.log(data);
        return UserModel.update({
            number: data.number
        }, {
            where: {
                id: id
            },
            returning: '*'
        })
    }

    static async FindUserRoleById(id: number): Promise<string | null> {
        const user = await UserModel.findOne({
            where: { id },
            attributes: ['role'],
            raw: true
        });

        return user ? user.role : null;
    }

    static async FindQARoleUser(qaIds: number[]) {
        return UserModel.findAll({
            where: { id: qaIds },
            attributes: ["id", "name"],
            raw: true
        });
    }

    static async FindDeveloperRoleUser(developerIds: number[]) {
        return UserModel.findAll({
            where: { id: developerIds },
            attributes: ["id", "name"],
            raw: true
        });
    }
}