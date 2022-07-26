import mongoose, { ConnectOptions } from 'mongoose';
import { DB_URI, DB_NAME } from '../config';

if (!DB_URI) {
  throw new Error('DB_URI is not defined');
}
if (!DB_NAME) {
  throw new Error('DB_NAME is not defined');
}

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
    .once('open', () => {
      console.log(`MongoDB connected to ${DB_URI} with database ${DB_NAME}`);
    });
})();
