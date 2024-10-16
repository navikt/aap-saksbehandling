export const pipe =
  (...functions: Function[]) =>
  (arg: any) =>
    functions.reduce((acc, fn) => fn(acc), arg);
