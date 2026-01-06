import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class ProjectQA extends Model {
    public id!: number;
    public project_id!: number;
    public qa_id!: number;
  }

  ProjectQA.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      qa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "project_qas",
      timestamps: true
    }
  );

    (ProjectQA as any).associate = (models: any) => {
    ProjectQA.belongsTo(models.Project, {
      foreignKey: "project_id"
    });

    ProjectQA.belongsTo(models.User, {
      foreignKey: "qa_id"
    });
  };

  return ProjectQA;
};
