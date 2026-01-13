import { db } from "../helpers";
import { createUserParams, updateProfile, user } from "../interface/User";
const UserModel = db.User as any;



export class UserHandler {
    static async findUserByEmail(email: string): Promise<user | null> {
        return UserModel.findOne({
            where: { email }
        })
    }

    static async signUpUser({ name, email, password, number, role }: createUserParams): Promise<user> {
        return UserModel.create({
            email,
            name,
            password,
            role,
            number
        });
    }

    static async findUserById(id: number): Promise<user | null> {
        return UserModel.findOne({
            where: { id }
        })
    }

    static async updateProfile(data: updateProfile, id: number): Promise<user | null> {
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

    static async findUserRoleById(id: number): Promise<string | null> {
        const user = await UserModel.findOne({
            where: { id },
            attributes: ['role'],
            raw: true
        });

        return user ? user.role : null;
    }

    static async findQARoleUser(qaIds: number[]) {
        return UserModel.findAll({
            where: { id: qaIds },
            attributes: ["id", "name"],
            raw: true
        });
    }
    static async findAll(role: "manager" | "qa" | "developer"): Promise<{ id: number; name: string }[]> {
        return UserModel.findAll({
            where: { role: role },
            attributes: ["id", "name"],
            raw: true
        });
    }

    static async findDeveloperRoleUser(developerIds: number[]) {
        return UserModel.findAll({
            where: { id: developerIds },
            attributes: ["id", "name"],
            raw: true
        });
    }
}