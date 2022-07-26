import WebSocketServer from 'ws';
import { Server } from 'http';
import { Logger } from '../utils';
import { WEBSOCKET_SERVER_KEY } from '../config';

// Creating a new websocket server

const InitializedWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer.Server({
    server: server
  });
  Logger.info('Websocket server is running');
  // Creating connection using websocket
  wss.on('connection', (ws, req) => {
    let clientId = req.url && req.url.includes('clientId') && req.url.split('clientId=')[1];
    if (!clientId) {
      ws.close();
      throw new Error('Client id is not defined');
    }
    ws.clientId = clientId;

    Logger.log('A new client has connected: ' + clientId);
    // sending message

    ws.on('message', (data) => {
      //client.send(data)
      const stringData = data.toString();
      console.log('Received message from client: ' + stringData);
      try {
        const json = JSON.parse(stringData);
        if (json.key == WEBSOCKET_SERVER_KEY) {
          wss.clients.forEach((client) => {
            Logger.log('client id: ' + client.clientId);
            if (json.clients == 'ALL') {
              client.send(data);
            } else if (json.clients && json.clients.length > 0 && json.clients.includes(client.clientId)) {
              client.send(data);
            }
          });
        }
      } catch (error) {
        Logger.error(error);
      }
    });

    // handling what to do when clients disconnects from server
    ws.on('close', () => {
      Logger.log('Client has disconnected: ' + clientId);
    });
    // handling client connection error
    ws.onerror = function (event) {
      Logger.error(event);
    };
  });

  return wss;
};

export default InitializedWebSocketServer;
