import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Project extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public logo!: string;
    public manager_id!: number;
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "projects",
      timestamps: true
    }
  );

  (Project as any).associate = (models: any) => {
    Project.belongsTo(models.User, {
      foreignKey: "manager_id",
      as: "manager"
    });

    Project.hasMany(models.Bug, {
      foreignKey: "project_id"
    });

    Project.belongsToMany(models.User, {
      through: models.ProjectQA,
      foreignKey: "project_id",
      otherKey: "qa_id",
      as: "qas"
    });

    Project.belongsToMany(models.User, {
      through: models.ProjectDeveloper,
      foreignKey: "project_id",
      otherKey: "developer_id",
      as: "developers",
    });

  };

  return Project;
};
