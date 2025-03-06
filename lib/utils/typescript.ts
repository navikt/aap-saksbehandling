export function exhaustiveCheck(_param: never): never {
  throw new Error('Skal ikke nå hit', _param);
}
