export const pipe =
  <T>(...functions: Function[]) =>
  (arg: T) =>
    functions.reduce((acc, fn) => fn(acc), arg);
