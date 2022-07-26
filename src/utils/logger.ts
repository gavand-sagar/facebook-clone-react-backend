import { blue, green, red, yellow, Color } from 'colors';
import WebSocketServer from 'ws';

export class Logger {
  static log(message: string | any, color: Color = green) {
    if (typeof message === 'string') {
      console.log(`[app] 🪵 ${color(message)}`);
    } else {
      console.log(`[app] 🪵 ${color(`Log started --------------------------------------------------`)}`);
      console.log(message);
      console.log(`[app] 🪵 ${color(`Log ended --------------------------------------------------`)}`);
    }
  }

  static error(e: Error | WebSocketServer.ErrorEvent | any) {
    if (e instanceof Error) {
      const errorStack = e?.stack?.split('\n');
      console.error(`[app] 🔴 ${red(e.message)}`);
      if (errorStack) {
        let i = 0;
        errorStack.forEach((line) => {
          i++;
          console.error(`${i}# ${red(line)}`);
        });
      }
    } else {
      if (e.target instanceof WebSocketServer) {
        const wsError = e as WebSocketServer.ErrorEvent;
        console.error(`[app] 🔴 ${red(`WebSocketServer Error Message: ${wsError.message}`)}`);
        if (wsError.type) {
          console.error(`[app] 🔴 ${red(`Type: wsError.type`)}`);
        }
        if (wsError.error) {
          console.error(`[app] 🔴 ${red(`Error: `)}`, wsError.error);
        }
        return;
      }
      console.error(`[app] 🔴 ${red(`Error started --------------------------------------------------`)}`);
      console.error(e);
      console.error(`[app] 🔴 ${red(`Error ended --------------------------------------------------`)}`);
    }
  }

  static warn(message: string | any) {
    if (typeof message === 'string') {
      console.warn(`[app] 🟡 ${yellow(message)}`);
    } else {
      console.warn(`[app] 🟡 ${yellow(`Warning started --------------------------------------------------`)}`);
      console.warn(message);
      console.warn(`[app] 🟡 ${yellow(`Warning ended --------------------------------------------------`)}`);
    }
  }

  static info(message: string | object) {
    if (typeof message === 'string') {
      console.info(`[app] 💬 ${blue(message)}`);
    } else {
      console.info(`[app] 💬 ${blue(`Info started --------------------------------------------------`)}`);
      console.info(message);
      console.info(`[app] 💬 ${blue(`Info ended --------------------------------------------------`)}`);
    }
  }
}
