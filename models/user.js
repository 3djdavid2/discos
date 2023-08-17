import { DataTypes } from "sequelize";

const User= (sequelize,Sequelize)=>{
    const User = sequelize.define("users", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },     
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      
      });

      return User;

}

export default User;

