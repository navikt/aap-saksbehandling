'use client';

import { VStack } from '@navikt/ds-react';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { getJaNeiEllerIkkeBesvart } from 'lib/utils/form';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import {
  erArbeidsevnenNedsattLabel,
  erNedsettelseIArbeidsevneAvEnVissVarighetLabel,
  erNedsettelseIArbeidsevneMerEnnHalvpartenLabel,
  erSkadeSykdomEllerLyteVesentligdelLabel,
  harSkadeSykdomEllerLyteLabel,
  vilkårsvurderingLabel,
} from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingFormInput';
import { Dato } from 'lib/types/Dato';
import { Sykdomvurdering } from 'lib/types/types';

interface Props {
  vurdering: Sykdomvurdering;
}

export const TidligereSykdomsvurdering = ({ vurdering }: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål={'Fra dato'} svar={new Dato(vurdering.fom).formaterForFrontend()} />
      <SpørsmålOgSvar spørsmål={vilkårsvurderingLabel} svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål={harSkadeSykdomEllerLyteLabel}
        svar={getJaNeiEllerIkkeBesvart(vurdering.harSkadeSykdomEllerLyte)}
      />
      <SpørsmålOgSvar
        spørsmål={'Hoveddiagnose'}
        svar={
          vurdering.hoveddiagnose
            ? diagnoseSøker(vurdering.kodeverk as DiagnoseSystem, vurdering.hoveddiagnose)[0]?.label
            : ''
        }
      />
      <SpørsmålOgSvar
        spørsmål={'Bidiagnose'}
        svar={(vurdering.bidiagnoser ?? ['Ingen'])
          .map((it) => diagnoseSøker(vurdering.kodeverk as DiagnoseSystem, it)[0]?.label)
          .filter(Boolean)
          .join(', ')}
      />
      <SpørsmålOgSvar
        spørsmål={erArbeidsevnenNedsattLabel}
        svar={getJaNeiEllerIkkeBesvart(vurdering.erArbeidsevnenNedsatt)}
      />
      <SpørsmålOgSvar
        spørsmål={erNedsettelseIArbeidsevneMerEnnHalvpartenLabel}
        svar={getJaNeiEllerIkkeBesvart(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten)}
      />
      <SpørsmålOgSvar
        spørsmål={erSkadeSykdomEllerLyteVesentligdelLabel}
        svar={getJaNeiEllerIkkeBesvart(vurdering.erSkadeSykdomEllerLyteVesentligdel)}
      />
      <SpørsmålOgSvar
        spørsmål={erNedsettelseIArbeidsevneAvEnVissVarighetLabel}
        svar={getJaNeiEllerIkkeBesvart(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet)}
      />
    </VStack>
  );
};
