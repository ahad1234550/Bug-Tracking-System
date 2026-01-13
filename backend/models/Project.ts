import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Project extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public logo!: string;
  }

  Project.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      logo: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, tableName: "projects", timestamps: true }
  );

  (Project as any).associate = (models: any) => {
    Project.belongsToMany(models.User, { through: models.ProjectUser, foreignKey: "project_id", as: "users" });

    Project.hasMany(models.Bug, { foreignKey: "project_id", as: "bugs" });

    Project.hasMany(models.ProjectUser, {
      foreignKey: "project_id",
      as: "projectUsers"
    });

    (Project as any).associate = (models: any) => {
      Project.belongsToMany(models.User, {
        through: models.ProjectUser,
        foreignKey: "project_id",
        as: "users",
        onDelete: "CASCADE"
      });

      Project.hasMany(models.Bug, {
        foreignKey: "project_id",
        as: "bugs",
        onDelete: "CASCADE" 
      });
    };


  };

  return Project;
};
