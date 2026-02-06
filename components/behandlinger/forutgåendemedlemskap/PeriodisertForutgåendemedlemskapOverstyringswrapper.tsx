'use client';

import {
  AutomatiskLovvalgOgMedlemskapVurdering,
  BeregningTidspunktGrunnlag,
  MellomlagretVurdering,
  PeriodisertForutgåendeMedlemskapGrunnlag,
  RettighetsperiodeGrunnlag,
} from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/automatiskvurderingforutgåendemedlemskap/AutomatiskVurderingForutgåendeMedlemskap';
import { ForutgåendeMedlemskapPeriodisert } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapPeriodisert';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  grunnlag: PeriodisertForutgåendeMedlemskapGrunnlag;
  harAvklaringsbehov: boolean;
  visOverstyrKnapp: boolean;
  harYrkesskade: boolean;
  children: ReactNode;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP | Behovstype.MANUELL_OVERSTYRING_MEDLEMSKAP;
  rettighetsperiodeGrunnlag?: RettighetsperiodeGrunnlag;
  beregningstidspunktGrunnlag?: BeregningTidspunktGrunnlag;
}

export const PeriodisertForutgåendemedlemskapOverstyringswrapper = ({
  children,
  automatiskVurdering,
  grunnlag,
  harAvklaringsbehov,
  behandlingVersjon,
  readOnly,
  visOverstyrKnapp,
  harYrkesskade,
  initialMellomlagretVurdering,
  behovstype,
  beregningstidspunktGrunnlag,
}: Props) => {
  const [overstyring, setOverstyring] = useState<boolean>(initialMellomlagretVurdering !== undefined);
  return (
    <>
      <AutomatiskVurderingForutgåendeMedlemskap
        vurdering={automatiskVurdering}
        setOverstyring={setOverstyring}
        visOverstyrKnapp={visOverstyrKnapp}
        visOverstyringsBehov={overstyring}
        harYrkesskade={harYrkesskade}
      />
      {children}
      {overstyring && !harAvklaringsbehov && (
        <ForutgåendeMedlemskapPeriodisert
          behandlingVersjon={behandlingVersjon}
          grunnlag={grunnlag}
          behovstype={behovstype}
          readOnly={readOnly}
          overstyring={true}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
          beregningstidspunktGrunnlag={beregningstidspunktGrunnlag}
        />
      )}
    </>
  );
};
