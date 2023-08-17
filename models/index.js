import  Sequelize  from "sequelize";
import sequelize from '../config/db.js';

import Disco from './disco.js';
import Estado from './estado.js';
import User from './user.js';

import createEstado from '../libs/initialSetup.js';

const db = {};
db.sequelize = sequelize;//asigna una instancia de sequelize, la conexión a la db paart ejecutar queries
db.Sequelize = Sequelize;//asigna el objeto Sequelize, permite el acceso a la libreria Sequelize y sus funcionalidades


db.Disco=Disco(sequelize, Sequelize);
db.Estado=Estado(sequelize, Sequelize);
db.User=User(sequelize, Sequelize);

//Create Data foreignKey

createEstado(db.Estado)

//Relationships

db.Estado.hasOne(db.Disco, {
    foreignKey: 'estadoId',
    sourceKey: 'id'
});
db.Disco.belongsTo(db.Estado, {
    foreignKey: 'estadoId',
    targetId: 'id'
});


export default db;