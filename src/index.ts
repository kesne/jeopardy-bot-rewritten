// import './slack';
import { interpret } from 'xstate';
import machine from './machines';

const service = interpret(machine).onTransition(state => {
  console.log(state);
});

service.start();

service.send('NEW_GAME');

service.stop();
