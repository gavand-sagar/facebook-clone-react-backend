import Config, { PORT, DB_URI, DB_NAME, FRONTEND_ORIGIN, PUBLIC_DIR } from './config';
// Verify configuration values
Config.verify();

import { Logger } from './utils';
import InitializedWebSocketServer from './websocket-server/server';
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PostRoute from './routes/post.routes';
import UserRoute from './routes/user.routes';

// Bootstrap application with express
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ credentials: true, origin: FRONTEND_ORIGIN }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json());
app.use('/', express.static(PUBLIC_DIR));

// Routes
app.use(PostRoute);
app.use(UserRoute);
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Not found'
  });
});

const server = app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
});

function listen() {
  Logger.info(`MongoDB connected to ${DB_URI} with database ${DB_NAME}`);
  if (app.get('env') === 'test') return;
  InitializedWebSocketServer(server);
}

//Set up default mongoose connection
(function connect() {
  mongoose.connect(`${DB_URI}`, {
    dbName: DB_NAME,
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions);

  return mongoose.connection
    .on('error', console.error.bind(console, 'MongoDB connection error:'))
    .on('disconnected', connect)
    .once('open', listen);
})();
