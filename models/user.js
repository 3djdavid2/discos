import { DataTypes } from "sequelize";

function User(sequelize,Sequelize){
    return User = sequelize.define("users", {
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


}


export default User;
