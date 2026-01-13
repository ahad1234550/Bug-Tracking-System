import { col, fn, literal, Op } from "sequelize";
import { db } from "../helpers";
import { project, projectDeveloper, projectQA } from "../interface/Project";

const projectModel = db.Project as any;

const projectUserModel = db.ProjectUser as any;

const userModel = db.User as any;

const bugModel = db.Bug as any;

const projectQaModel = db.ProjectQA as any;

const projectDeveloperModel = db.ProjectDeveloper as any;

export class ProjectHandler {
    static async addProject(name: string, description: string, logo: string): Promise<project> {
        return projectModel.create({
            name,
            description,
            logo,
        });
    }

    static async addUserToProject(project_id: number, user_id: number) {
        return projectUserModel.create({
            project_id,
            user_id
        });
    }


    static async readProjects(userId: number, search: string): Promise<any[]> {
        const projects = await projectModel.findAll({
            where: search
                ? {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                }
                : undefined,

            include: [
                {
                    model: projectUserModel,
                    as: "projectUsers",
                    where: { user_id: userId },
                    attributes: [],
                },
                {
                    model: bugModel,
                    as: "bugs",
                    attributes: [],
                }
            ],

            attributes: [
                "id",
                "name",
                "description",
                "logo",
                [fn("COUNT", col("bugs.id")), "totalBugs"],
                [
                    fn(
                        "SUM",
                        literal(`CASE WHEN bugs.status = 'completed' THEN 1 ELSE 0 END`)
                    ),
                    "completedBugs"
                ]
            ],

            group: ["Project.id"],
        });

        return projects;
    }

    static async updateProject(name: string, description: string, logo: string, id: number): Promise<project> {
        const [affectedCount, updatedRows] = await projectModel.update(
            { name, description, logo },
            { where: { id }, returning: true }
        );

        return updatedRows[0];
    }

    static async findQADeveloperInfoFromProject(id: number) {
        return projectUserModel.findAll({
            where: { project_id: id },
            include: [
                {
                    model: userModel,
                    as: "user",
                    attributes: ["role"],
                    where: { role: ["qa", "developer"] },
                },
            ],
            attributes: ["user_id"],
        });
    }

    static async usersToDelete(projectId: Number, userIdsToDelete: number[]) {
        await projectUserModel.destroy({
            where: { project_id: projectId, user_id: userIdsToDelete },
        });
    }

    static async deleteProjectById(id: number) {
        await projectModel.destroy({
            where: {
                id,
            }
        })
    }

    static async deleteQAProject(project_id: number): Promise<void> {
        await projectQaModel.destroy({
            where: { project_id }
        })
    }

    static async deleteDeveloperProject(project_id: number): Promise<void> {
        await projectDeveloperModel.destroy({
            where: { project_id }
        })
    }

    static async addQAForProject(project_id: number, qa_id: number): Promise<projectQA> {
        return projectQaModel.create({
            project_id,
            qa_id
        })
    }
    static async addDeveloperForProject(project_id: number, developer_id: number): Promise<projectDeveloper> {
        return projectDeveloperModel.create({
            project_id,
            developer_id
        })
    }

    static async findProjectByIds(ids: number[]): Promise<project[]> {
        return await projectModel.findAll({
            where: { id: ids },
            raw: true
        });
    }

    static async findProjectById(id: number): Promise<project | null> {
        return await projectModel.findOne({
            where: { id },
            raw: true
        });
    }


    static async developer_Exist_For_Project(project_id: number, developer_id: number): Promise<project | null> {
        return await projectUserModel.findOne({
            where: {
                project_id,
                user_id : developer_id
            },
            raw: true
        });
    }

    static async getAllRolesRelatedForProject(project_id: number, role: string) {
        const users = await projectUserModel.findAll({
            where: { project_id },
            include: [
                {
                    model: userModel,
                    as: "user",
                    where: { role },
                    attributes: ["id", "name"]
                }
            ],
            attributes: []
        });

        return users.map((pu) => pu.user);
    }
}