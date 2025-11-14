'use client';

import { ArbeidsopptrappingGrunnlagResponse, MellomlagretVurdering } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: ArbeidsopptrappingGrunnlagResponse;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}
export const Arbeidsopptrapping = ({ behandlingVersjon, readOnly, grunnlag, initialMellomlagretVurdering }: Props) => {
  return <div>hei</div>;
};
