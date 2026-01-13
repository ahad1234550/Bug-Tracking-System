import { Op } from "sequelize";
import { db } from "../helpers";
import { bug } from "../interface/Bug";

const bugModel = db.Bug as any;

const userModel = db.User as any;

const buildSearchCondition = (search: string) => {
    if (!search) return {};

    return {
        [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } }
        ]
    };
};

const orderByFilter = (filter?: "ascending" | "descending") => {
    if (!filter) return [["createdAt", "DESC"]];

    return [
        ["createdAt", filter === "ascending" ? "ASC" : "DESC"],
    ];
};

const developerFilter = (developer_id?: number) => {
  if (!developer_id || developer_id === 0) return {};
  return { developer_id };
};

export class BugHandler {
    static async addBug(title: string, description: string, deadline: Date, type: "feature" | "bug", status: "new" | "started" | "completed" | "resolved", project_id: number, qa_id: number, screenshot: string, developer_id: number): Promise<bug> {
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

    static async getManagerBug(
        projectId: number,
        search?: string,
        filter?: "ascending" | "descending",
        developer_id?: number
    ) {
        const bugs = await bugModel.findAll({
            where: {
                project_id: projectId,
                ...buildSearchCondition(search),
                ...developerFilter(developer_id),
            },
            include: [
                {
                    model: userModel,
                    as: "developer",
                    attributes: ["id", "name"],
                },
            ],
            order: orderByFilter(filter),
            raw: false,
        });

        return bugs.map((bug) => ({
            ...bug.get({ plain: true }),
            developer_name: bug.developer?.name || null,
        }));
    }


    static async getQABug(
        qa_id: number,
        project_id: number,
        search?: string,
        filter?: "ascending" | "descending",
        developer_id?: number
    ) {
        const bugs = await bugModel.findAll({
            where: {
                project_id,
                qa_id,
                ...buildSearchCondition(search),
                ...developerFilter(developer_id),
            },
            include: [
                {
                    model: userModel,
                    as: "developer",
                    attributes: ["id", "name"],
                },
            ],
            order: orderByFilter(filter),
            raw: false,
        });

        return bugs.map((bug) => ({
            ...bug.get({ plain: true }),
            developer_name: bug.developer?.name || null,
        }));
    }


    static async getDeveloperBug(
        developer_id: number,
        project_id: number,
        search?: string,
        filter?: "ascending" | "descending",
    ) {
        const bugs = await bugModel.findAll({
            where: {
                project_id,
                developer_id,
                ...buildSearchCondition(search),
            },
            include: [
                {
                    model: userModel,
                    as: "developer",
                    attributes: ["id", "name"],
                },
            ],
            order: orderByFilter(filter),
            raw: false,
        });

        return bugs.map((bug) => ({
            ...bug.get({ plain: true }),
            developer_name: bug.developer?.name || null,
        }));
    }


    static async findQABug(qa_id: number, id: number): Promise<bug> {
        return bugModel.findOne({
            where: {
                id,
                qa_id
            },
            raw: true
        })
    }


    static async findDeveloperBug(developer_id: number, id: number): Promise<bug> {
        return bugModel.findOne({
            where: {
                id,
                developer_id
            },
            raw: true
        })
    }

    static async findBugById(id: number): Promise<bug> {
        return bugModel.findOne({
            where: {
                id
            },
            raw: true
        })
    }

    static async changeStatus(id: number, status: string) {
        const bug = await bugModel.findByPk(id);

        if (!bug) return null;

        bug.status = status;
        await bug.save();

        return bug;
    }

    static async deleteBugById(id: number): Promise<void> {
        await bugModel.destroy({
            where: { id }
        })
    }
}