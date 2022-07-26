export default {};

declare module 'ws' {
  class CustomWebSocket extends WebSocket {
    clientId: string;
  }
  export interface WebSocket extends CustomWebSocket {
    online: boolean;
  }
}
