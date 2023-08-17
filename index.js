import express from 'express';
import morgan from 'morgan';
import 'dotenv/config'
import cors from 'cors';

import sequelize from './config/db.js'
import { router as discos } from './routes/DiscoRoutes.js'
import { router as users } from './routes/UserRoutes.js'

const app = express();

const port = process.env.PORT || 4000;
const corsOptions = {
  origin: '*', // Reemplazar con dominio
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));

//uso de rutas

app.use('/discos', discos)
app.use('/users', users)

//iniciamos sequelize
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tables created");
  })
  .catch((err) => {
    console.log(err);
  });


app.listen(port, () => {
  console.log(`Server ready at:${port}`);
});

