import {useStore} from '@tanstack/react-store';
import {Store} from '@tanstack/store';

type Animal = 'dogs' | 'cats';

export const globalStore = new Store({
  dogs: 0,
  cats: 0,
});

export function useAnimal(animal: Animal) {
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
