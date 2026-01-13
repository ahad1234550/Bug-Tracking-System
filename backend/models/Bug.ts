import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Bug extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public deadline!: Date;
    public screenshot!: string;
    public type!: "feature" | "bug";
    public status!: string;
    public project_id!: number;
    public qa_id!: number;
    public developer_id!: number;
  }

  Bug.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      deadline: { type: DataTypes.DATE, allowNull: true },
      screenshot: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.ENUM("feature", "bug"), allowNull: false },
      status: { type: DataTypes.ENUM("new", "started", "completed", "resolved"), allowNull: false, defaultValue: "new" },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      qa_id: { type: DataTypes.INTEGER, allowNull: false },
      developer_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    { sequelize, tableName: "bugs", timestamps: true }
  );

  (Bug as any).associate = (models: any) => {
    Bug.belongsTo(models.User, { foreignKey: "qa_id", as: "qa" });
    Bug.belongsTo(models.User, { foreignKey: "developer_id", as: "developer" });

    Bug.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project",
      onDelete: "CASCADE",
    });
  };


  return Bug;
};
