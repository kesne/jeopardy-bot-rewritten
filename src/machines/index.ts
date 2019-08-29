import { Machine, assign, spawn } from 'xstate';
import gameMachine from './game';
// import contestantMachine from './contestant';

const appMachine = Machine({
  id: 'app',
  context: {
    games: [],
    contestants: [],
  },
  // TODO: initializing state that transitions into an active state
  initial: 'active',
  states: {
    initializing: {},
    active: {},
  },
  on: {
    NEW_GAME: {
      actions: [
        assign({
          games: context => [
            ...context.games,
            {
              ref: spawn(gameMachine, 'game'),
            },
          ],
        }),
      ],
    },
  },
});

export default appMachine;
