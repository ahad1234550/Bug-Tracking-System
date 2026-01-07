import { Model } from "sequelize";

export interface project extends Model {
    id: number;
    name: string;
    description: string;
    logo: string;
    manager_id: number;
}

export interface projectQA extends Model {
    id: number,
    project_id: number,
    qa_id: number
}

export interface projectDeveloper extends Model {
    id: number,
    project_id: number,
    developer_id: number
}

export interface addProduct {
    name: string,
    description: string,
    QA: string[],
    developer: string[]
}
