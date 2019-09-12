import slack from './slack';
import { interpret } from 'xstate';
import machine from './machines';

const service = interpret(machine).onTransition(state => {
  console.log(state);
});

(async () => {
  await slack.start();

  service.start();
})();
