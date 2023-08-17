import { DataTypes } from "sequelize";

const Disco= (sequelize,Sequelize)=>{
    const Disco = sequelize.define("discos", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        estadoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        autor: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        precio: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        fechaLanzamiento: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        imagen: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      });

      return Disco;

}

export default Disco;

