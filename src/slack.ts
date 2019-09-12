import signale from 'signale';
import { RTMClient } from '@slack/rtm-api';

const SUPER_SECRET_TOKEN_DO_NOT_SHARE = 'Q3ByOVVOdFZjcGdOdEVDdU5UVjJZYkF1LTM4MzkyMDI0NDcxLWJ4b3g=';

function decodeToken(token: string) {
  return Buffer.from(token, 'base64')
    .toString('utf-8')
    .split('')
    .reverse()
    .join('');
}

// Initialize
const rtm = new RTMClient(decodeToken(SUPER_SECRET_TOKEN_DO_NOT_SHARE));

class Slack {
  listeners: Set<{
    input: string;
    resolve: (result: any) => void;
  }> = new Set();

  async start() {
    const { self } = await rtm.start();
    signale.info(`🎉  Connected to slack as "${(self as any).name}"`);
    rtm.on('message', this.handleMessage);
  }

  handleMessage = (event: any) => {
    this.listeners.forEach((entry) => {
      const { input, resolve } = entry;
      if (input === event.text) {
        signale.debug('Resolving input with...', event);
        resolve(event);
        this.listeners.delete(entry);
      }
    });
  };

  waitForInput(input: string) {
    signale.debug('Waiting for input...');
    let outerResolve: (result: any) => void;
    const inputPromise = new Promise(innerResolve => {
      outerResolve = innerResolve;
    });

    this.listeners.add({
      input,
      resolve: outerResolve!,
    });

    return inputPromise;
  }

  send(channel: string, message: string) {
    rtm.sendMessage(message, channel);
  }
}

export default new Slack();
