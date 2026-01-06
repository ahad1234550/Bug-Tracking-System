import { db } from "../helpers";
import { Model } from "sequelize";

const bugModel = db.Bug as any;


interface Bug extends Model {
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

export class BugHandler {
    static async addBug(title: string, description: string, deadline: Date, type: "feature" | "bug", status: "new" | "started" | "completed" | "resolved", project_id: number, qa_id: number, screenshot: string, developer_id: number): Promise<Bug> {
        return bugModel.create({
            title,
            description,
            deadline,
            screenshot,
            type,
            status,
            project_id,
            qa_id,
            developer_id
        })
    }

    static async getManagerBug(project_id: number): Promise<Bug[]> {
        return bugModel.findAll({
            where: { project_id: project_id },
            raw: true
        })
    }

    static async getQABug(qa_id: number, project_id: number): Promise<Bug[]> {
        return bugModel.findAll({
            where: {
                project_id,
                qa_id
            },
            raw: true
        })
    }

    static async FindQABug(qa_id: number, id: number): Promise<Bug> {
        return bugModel.findOne({
            where: {
                id,
                qa_id
            },
            raw: true
        })
    }

    static async getDeveloperBug(developer_id: number, project_id: number): Promise<Bug[]> {
        return bugModel.findAll({
            where: {
                project_id,
                developer_id
            },
            raw: true
        });
    }

    static async FindDeveloperBug(developer_id: number, id: number): Promise<Bug> {
        return bugModel.findOne({
            where: {
                id,
                developer_id
            },
            raw: true
        })
    }

    static async FindBugById(id: number): Promise<Bug> {
        return bugModel.findOne({
            where: {
                id
            },
            raw: true
        })
    }

    static async ChangeStatus(id: number, status: string) {
        const bug = await bugModel.findByPk(id);

        if (!bug) return null;

        bug.status = status;
        await bug.save();

        return bug;
    }
    
    static async deleteBugByProjectId(project_id: number): Promise<void>{
        await bugModel.destroy({
            where: { project_id }
        })
    }
}