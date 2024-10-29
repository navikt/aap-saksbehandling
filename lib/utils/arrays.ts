type TypeMedÅr = {
  år: string;
};

export const sorterEtterÅrIStigendeRekkefølge = <T extends TypeMedÅr>(input: T[]): T[] => {
  return input.toSorted((a, b) => Number.parseInt(a.år, 10) - Number.parseInt(b.år, 10));
};
