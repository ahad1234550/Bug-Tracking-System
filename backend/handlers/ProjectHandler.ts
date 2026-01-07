import { db } from "../helpers";
import { Model } from "sequelize";

const projectModel = db.Project as any;

const project_qa_Model = db.ProjectQA as any;

const project_developer_Model = db.ProjectDeveloper as any;

interface project extends Model {
    id: number;
    name: string;
    description: string;
    logo: string;
    manager_id: number;
}

interface projectQA extends Model {
    id: number,
    project_id: number,
    qa_id: number
}
interface projectDeveloper extends Model {
    id: number,
    project_id: number,
    developer_id: number
}

export class ProjectHandler {
    static async addProject(name: string, description: string, logo: string, manager_id: number): Promise<project> {
        return projectModel.create({
            name,
            description,
            logo,
            manager_id
        });
    }

    static async updateProject(name: string, description: string, logo: string, id: number): Promise<project> {
        const [affectedCount, updatedRows] = await projectModel.update(
            { name, description, logo },
            { where: { id }, returning: true }
        );

        return updatedRows[0];
    }

    static async deleteProjectById(id: number, manager_id: number){
        await projectModel.destroy({
            where: {
                id,
                manager_id
            }
        })
    }

    static async deleteQAProject(project_id: number): Promise<void> {
        await project_qa_Model.destroy({
            where: { project_id }
        })
    }

    static async deleteDeveloperProject(project_id: number): Promise<void> {
        await project_developer_Model.destroy({
            where: { project_id }
        })
    }

    static async addQAForProject(project_id: number, qa_id: number): Promise<projectQA> {
        return project_qa_Model.create({
            project_id,
            qa_id
        })
    }
    static async addDeveloperForProject(project_id: number, developer_id: number): Promise<projectDeveloper> {
        return project_developer_Model.create({
            project_id,
            developer_id
        })
    }

    static async readManagerProjects(manager_id: number): Promise<project[] | null> {
        return projectModel.findAll({
            where: { manager_id },
            raw: true
        })
    }

    static async readQAProjects(qa_id: number): Promise<{ project_id: number }[]> {
        return project_qa_Model.findAll({
            where: { qa_id },
            attributes: ['project_id'],
            raw: true
        });
    }
    static async readDeveloperProjects(developer_id: number): Promise<{ project_id: number }[]> {
        return project_developer_Model.findAll({
            where: { developer_id },
            attributes: ['project_id'],
            raw: true
        });
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

    static async findProjectByIdAndManager(id: number, manager_id: number): Promise<project | null> {
        return await projectModel.findOne({
            where: { 
                id,
                manager_id
             },
            raw: true
        });
    }
    
    static async developer_Exist_For_Project(project_id: number, developer_id: number): Promise<project | null> {
        return await project_developer_Model.findOne({
            where: {
                project_id,
                developer_id
            },
            raw: true
        });
    }

    static async getAllQAForProject(project_id: number): Promise<number[]> {
        return project_qa_Model.findAll({
            where: { project_id },
            attributes: ['qa_id'],
            raw: true
        });

    }


    static async getAllDeveloperForProject(project_id: number): Promise<number[]> {
        return project_developer_Model.findAll({
            where: { project_id },
            attributes: ['developer_id'],
            raw: true
        });
    }



}