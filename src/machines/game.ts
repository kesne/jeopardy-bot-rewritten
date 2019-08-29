import { Machine } from 'xstate';

const clueStates = {
  initial: 'Display',
  onDone: 'ClueSelect',
  states: {
    AnswerDailyDouble: {
      on: { NEXT: 'CollectWager' },
    },

    CollectWager: {
      on: { COLLECTED: 'Display' },
    },

    Display: {
      on: {
        NEXT: [{ target: 'GuessWindow' }],
      },
    },

    GuessWindow: {
      onDone: 'ClueDone',

      initial: 'Wait',

      after: {
        CLUE_TIMEOUT: 'ClueDone',
      },

      states: {
        Wait: {
          on: {
            GUESS: 'Attempt',
          },
        },

        Attempt: {
          on: {
            Next: 'Wait',
            // NEXT: [
            //   {
            //     target: 'GuessDone',
            //     // cond: 'guessCorrect',
            //   },
            //   // {
            //   //   target: 'WaitForGuess',
            //   //   cond: 'guessIncorrect',
            //   // },
            // ],
          },
        },

        Done: {
          type: 'final',
        },
      },
    },

    ClueDone: {
      type: 'final',
    },
  },
};

const gameMachine = Machine(
  {
    id: 'game',

    initial: 'ClueSelect',

    context: {},

    on: {
      END_GAME: 'GameOver',
    },

    states: {
      ClueSelect: {
        on: {
          SELECT_CLUE: [
            { target: 'Clue.AnswerDailyDouble', cond: 'isDailyDouble' },
            { target: 'Clue' },
          ],
        },
      },

      Clue: clueStates,

      GameOver: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      guessIncorrect: () => false,
      guestCorrect: () => true,
      isDailyDouble: () => false,
    },
    delays: {
      CLUE_TIMEOUT: 10000,
    },
  },
);

export default Machine({
  id:'mini-game',
  initial: 'all',
  states: {
    all: {}
  }
});
