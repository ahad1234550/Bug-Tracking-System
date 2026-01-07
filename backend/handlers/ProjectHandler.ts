import { db } from "../helpers";
import { project, projectDeveloper, projectQA } from "../interface/Project";

const projectModel = db.Project as any;

const projectQaModel = db.ProjectQA as any;

const projectDeveloperModel = db.ProjectDeveloper as any;

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

    static async readManagerProjects(manager_id: number): Promise<project[] | null> {
        return projectModel.findAll({
            where: { manager_id },
            raw: true
        })
    }

    static async readQAProjects(qa_id: number): Promise<{ project_id: number }[]> {
        return projectQaModel.findAll({
            where: { qa_id },
            attributes: ['project_id'],
            raw: true
        });
    }
    static async readDeveloperProjects(developer_id: number): Promise<{ project_id: number }[]> {
        return projectDeveloperModel.findAll({
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
        return await projectDeveloperModel.findOne({
            where: {
                project_id,
                developer_id
            },
            raw: true
        });
    }

    static async getAllQAForProject(project_id: number): Promise<number[]> {
        return projectQaModel.findAll({
            where: { project_id },
            attributes: ['qa_id'],
            raw: true
        });

    }


    static async getAllDeveloperForProject(project_id: number): Promise<number[]> {
        return projectDeveloperModel.findAll({
            where: { project_id },
            attributes: ['developer_id'],
            raw: true
        });
    }



}