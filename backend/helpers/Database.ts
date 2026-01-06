import fs from "fs";
import path from "path";
import config from "config";
import { Sequelize, DataTypes, Model, ModelCtor } from "sequelize";
const basename = path.basename(__filename);

interface DbInterface {
  [key: string]: ModelCtor<Model<any, any>> | Sequelize | typeof Sequelize;
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
}
const db: DbInterface = {} as DbInterface;

const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    sync: { alter : true },
    host: config.database.host,
    dialect: config.database.client,
    ssl: true,
    pool: config.database.pool,
    logging: true
  }
)

fs.readdirSync(path.join(__dirname, '../models'))
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' &&
      file.indexOf('.test.ts') === -1
    );
  })
  .forEach((file) => {
    const modelImport = require(path.join('../models', file));
    const modelDef = modelImport.default || modelImport;
    const model = modelDef(sequelize, DataTypes);
    db[model.name] = model;
  });


Object.keys(db).forEach((modelName) => {
  const model = db[modelName] as any;
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;