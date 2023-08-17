
import { DataTypes } from "sequelize";

const Estado= (sequelize,Sequelize)=>{
    const Estado = sequelize.define("estados", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
     
      });

      return Estado;

}

export default Estado;
