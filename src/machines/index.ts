import { Machine, assign, spawn } from 'xstate';
import gameMachine from './game';
import slack from '../slack';
// import contestantMachine from './contestant';
import * as strings from '../strings';

function createResponseNode(name: string, input: string, handler: () => string | Promise<string>) {
  return {
    initial: 'wait',
    states: {
      wait: {
        invoke: {
          id: `waitFor${name}`,
          src: () => slack.waitForInput(input),
          onDone: {
            target: 'send',
            actions: async (context: any, event: any) => {
              const response = await handler();
              slack.send(event.data.channel, response);
            },
          },
        },
      },

      send: {
        on: {
          '': { target: 'wait' },
        },
      },
    },
  };
}

const appMachine = Machine({
  id: 'app',
  type: 'parallel',
  context: {
    games: [],
    contestants: [],
  },
  states: {
    Help: createResponseNode('help', 'help', () => strings.help),
    Poke: createResponseNode('poke', 'poke', () => strings.poke),
    Uptime: createResponseNode('uptime', 'uptime', strings.uptime),
    NewGame: {
      invoke: {
        id: 'newGame',
        src: (context, event) => slack.waitForInput('new game'),
        onDone: {
          actions: assign({
            games: context => [
              ...context.games,
              {
                ref: spawn(gameMachine, 'game'),
              },
            ],
          }),
        },
      },
    },
  },
});

export default appMachine;
