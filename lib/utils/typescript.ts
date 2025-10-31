export function exhaustiveCheck(_param: never): never {
  console.error(`ExhaustiveCheck error: ${_param}`);
  throw new Error('Skal ikke nå hit', _param);
}
