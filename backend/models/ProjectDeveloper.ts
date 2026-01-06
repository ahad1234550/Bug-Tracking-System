import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class ProjectDeveloper extends Model {
    public id!: number;
    public project_id!: number;
    public developer_id!: number;
  }

  ProjectDeveloper.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      developer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "project_developers",
      timestamps: true,
    }
  );

  (ProjectDeveloper as any).associate = (models: any) => {
    ProjectDeveloper.belongsTo(models.Project, {
      foreignKey: "project_id",
    });

    ProjectDeveloper.belongsTo(models.User, {
      foreignKey: "developer_id",
      as: "developer",
    });
  };

  return ProjectDeveloper;
};
