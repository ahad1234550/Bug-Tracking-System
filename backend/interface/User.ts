import { Model } from "sequelize";

export interface updateProfile {
    number: string
}

export interface user extends Model {
    id: number,
    name: string,
    email: string,
    password: string,
    number: string,
    role: "manager" | "qa" | "developer",
}

export interface createUserParams {
    name: string,
    email: string,
    password: string,
    number: string,
    role: "manager" | "qa" | "developer"
}

export interface updateProfile {
    number: string
}