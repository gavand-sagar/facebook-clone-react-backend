import WebSocket from 'ws';
import { WEBSOCKET_SERVER_URL, WEBSOCKET_SERVER_KEY } from '../config';
import { Logger } from '../utils';

function sendWebSocketMessage({
  data,
  clients
}: {
  data: {
    type: string;
    payload: any;
  };
  clients: string[] | 'ALL';
}) {
  try {
    const ws = new WebSocket(`${WEBSOCKET_SERVER_URL}?clientId=SERVER`);
    ws.addEventListener('open', () => {
      try {
        console.log('We are connected');
        const dataObject = {
          key: WEBSOCKET_SERVER_KEY,
          data,
          clients: clients ?? 'ALL'
        };
        ws.send(JSON.stringify(dataObject));
        ws.close();
      } catch (error) {
        Logger.error(error);
      }
    });
  } catch (error) {
    Logger.error(error);
  }
}

export default sendWebSocketMessage;
