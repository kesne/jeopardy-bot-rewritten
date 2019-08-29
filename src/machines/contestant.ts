import { Machine } from 'xstate';

const contestantMachine = Machine(
  {
    id: 'contestant',
    context: {
      id: null,
      money: 0,
      wins: 0,
      losses: 0,
    },
    // TODO: initializing state that transitions into an active state
    initial: 'active',
    states: {
      initializing: {},
      active: {},
    },
    on: {
      REWARD_MONEY: {
        actions: 'rewardMoney',
      },
      WIN: {
        actions: 'win',
      },
      LOSE: {
        actions: 'lose',
      },
    },
  },
  {
    actions: {
      rewardMoney(context, event) {
        context.money += event.payload;
      },
      win(context) {
        context.wins += 1;
      },
      lose(context) {
        context.losses += 1;
      },
    },
  },
);

export default contestantMachine;
