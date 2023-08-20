import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import { Server } from "socket.io";

import sequelize from './config/db.js'
import { router as discos, router } from './routes/DiscoRoutes.js'
import { router as users } from './routes/UserRoutes.js'
import { router as wpp } from './routes/webpay_plus.js'

//
const app = express();

const port = process.env.PORT || 4000;

const corsOptions = {
  origin: '*', // Reemplazar con dominio
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));

//
const optionsServer = {
  requestCert: false,
  rejectUnauthorized: false
  ,
  path: '/chat/socket.io',
  cors: {
      origin: process.env.URL_SOCKET_ANG
  }
};

const server = http.createServer(app);
const io = new Server(server, optionsServer);


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(express.static(path.join(__dirname, "public")));


//uso de rutas

app.use('/api/discos', discos)
app.use('/api/users', users)
app.use('/api/webpay_plus', wpp);


//iniciamos conexión a bd con sequelize
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tables created");
  })
  .catch((err) => {
    console.log(err);
  });



server.listen(port, () => console.log("Server ready at port: ", port));

export default io;