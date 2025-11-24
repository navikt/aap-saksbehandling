'use client';

import { AutomatiskLovvalgOgMedlemskapVurdering, MellomlagretVurdering } from 'lib/types/types';
import { ReactNode, useState } from 'react';
import { AutomatiskVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/automatiskvurderingforutgåendemedlemskap/AutomatiskVurderingForutgåendeMedlemskap';
import { ForutgåendeMedlemskapPeriodisert } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapPeriodisert';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  automatiskVurdering: AutomatiskLovvalgOgMedlemskapVurdering;
  harAvklaringsbehov: boolean;
  visOverstyrKnapp: boolean;
  harYrkesskade: boolean;
  children: ReactNode;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype;
}

export const PeriodisertForutgåendemedlemskapOverstyringswrapper = ({
  children,
  automatiskVurdering,
  harAvklaringsbehov,
  behandlingVersjon,
  readOnly,
  visOverstyrKnapp,
  harYrkesskade,
  initialMellomlagretVurdering,
  behovstype,
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
          behovstype={behovstype}
          readOnly={readOnly}
          overstyring={true}
          initialMellomlagretVurdering={initialMellomlagretVurdering}
        />
      )}
    </>
  );
};
