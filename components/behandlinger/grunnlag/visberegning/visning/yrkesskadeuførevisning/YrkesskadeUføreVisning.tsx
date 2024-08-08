import React from 'react';
import { YrkesskadeUføreGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag?: YrkesskadeUføreGrunnlag;
}

export const YrkesskadeUføreVisning = ({ grunnlag }: Props) => {
  return <div>{JSON.stringify(grunnlag)}</div>;
};
