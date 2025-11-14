'use client';

import {
  AutomatiskLovvalgOgMedlemskapVurdering,
  MedIDNyeVurderinger,
  MellomlagretVurdering,
  PeriodisertLovvalgMedlemskapGrunnlag,
} from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingAvLovvalgOgMedlemskap } from 'components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap';
import { Behovstype } from 'lib/utils/form';
import { LovvalgOgMedlemskapPeriodisert } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapPeriodisert';

interface Props {
  behandlingsReferanse: string;
  grunnlag?: MedIDNyeVurderinger<PeriodisertLovvalgMedlemskapGrunnlag>;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  harAvklaringsbehov: boolean;
  visOverstyrKnapp?: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  children: ReactNode;
  behovstype: Behovstype;
}

export const LovvalgOgMedlemskapPeriodisertOverstyringswrapper = ({
  children,
  grunnlag,
  automatiskVurdering,
  harAvklaringsbehov,
  behandlingVersjon,
  readOnly,
  visOverstyrKnapp,
  initialMellomlagretVurdering,
  behovstype,
}: Props) => {
  const [overstyring, setOverstyring] = useState<boolean>(initialMellomlagretVurdering !== undefined);

  return (
    <>
      <AutomatiskVurderingAvLovvalgOgMedlemskap
        vurdering={automatiskVurdering}
        setOverstyring={setOverstyring}
        visOverstyrKnapp={visOverstyrKnapp}
        visOverstyringsBehov={overstyring}
      />
      {children}
      {overstyring && !harAvklaringsbehov && (
        <LovvalgOgMedlemskapPeriodisert
          behandlingVersjon={behandlingVersjon}
          grunnlag={grunnlag}
          readOnly={readOnly}
          overstyring={true}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
          behovstype={behovstype}
        />
      )}
    </>
  );
};
