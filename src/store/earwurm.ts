/*
import {Earwurm} from 'earwurm';

export const manager = new Earwurm({transitions: true});
*/

/*
import {useStore} from '@tanstack/react-store';
import {Store} from '@tanstack/store';

type Animal = 'dogs' | 'cats';

export const earwurmStore = new Store({
  dogs: 0,
  cats: 0,
});

export function useEarwurm(animal: Animal) {
  return useStore(globalStore, (state) => state[animal]);
}

export function incrementAnimal(animal: Animal) {
  globalStore.setState((state) => {
    return {
      ...state,
      [animal]: state[animal] + 1,
    };
  });
}
*/
