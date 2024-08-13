import React from 'react';
import { UføreGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag?: UføreGrunnlag;
}

export const UføreVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    return <div>Kunne ikke finne påkrevd grunnlag for uføre</div>;
  }

  return <div>{JSON.stringify(grunnlag)}</div>;
};
