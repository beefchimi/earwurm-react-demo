// Taken from:
// https://medium.com/@wujido20/runtime-types-in-typescript-5f74fc9dc6c4
export type TypeGuard<T> = (value: unknown) => T;

export const typedString: TypeGuard<string> = (value: unknown) => {
  if (typeof value !== 'string') throw new Error();
  return value;
};

export const typedNumber: TypeGuard<number> = (value: unknown) => {
  if (typeof value !== 'number') throw new Error();
  return value;
};

export const typedArray =
  <T>(inner: TypeGuard<T>) =>
  (value: unknown): T[] => {
    if (!Array.isArray(value)) throw new Error();
    return value.map(inner);
  };

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
export const typedObject = <T extends Record<string, TypeGuard<any>>>(
  inner: T,
) => {
  return (value: unknown): {[P in keyof T]: ReturnType<T[P]>} => {
    if (value === null || typeof value !== 'object') throw new Error();

    const out: {[P in keyof T]: ReturnType<T[P]>} = {} as any;

    for (const k in inner) {
      out[k] = inner[k]((value as any)[k]);
    }

    return out;
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
