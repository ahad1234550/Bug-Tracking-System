import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class ProjectUser extends Model {
    public id!: number;
    public project_id!: number;
    public user_id!: number;
  }

  ProjectUser.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, tableName: "project_users", timestamps: false }
  );

  (ProjectUser as any).associate = (models: any) => {
    ProjectUser.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    ProjectUser.belongsTo(models.Project, { foreignKey: "project_id", as: "project", onDelete: "CASCADE" });
  };

  

  return ProjectUser;
};
