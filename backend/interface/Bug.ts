import { Model } from "sequelize";

export interface bug extends Model {
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

export interface addBug {
    title: string,
    description: string,
    deadline: Date,
    type: "feature" | "bug",
    status: "new" | "started" | "completed" | "resolved",
    project_id: string,
    developer_id: string
}
