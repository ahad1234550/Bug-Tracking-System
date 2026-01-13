import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public number!: string;
    public role!: "manager" | "qa" | "developer";
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      number: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM("manager", "qa", "developer"), allowNull: false },
    },
    { sequelize, tableName: "users", timestamps: true }
  );

  (User as any).associate = (models: any) => {
    User.belongsToMany(models.Project, { through: models.ProjectUser, foreignKey: "user_id", as: "projects" });

    User.hasMany(models.Bug, { foreignKey: "qa_id", as: "qaBugs" });

    User.hasMany(models.Bug, { foreignKey: "developer_id", as: "assignedBugs" });
  };

  return User;
};
