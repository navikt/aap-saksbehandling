'use client';

import { VStack } from '@navikt/ds-react';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { getJaNeiEllerIkkeBesvart, getJaNeiJaForbigåendeEllerIkkeBesvart } from 'lib/utils/form';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import {
  harNedsattArbeidsevneLabel,
  erNedsettelseIArbeidsevneAvEnVissVarighetLabel,
  erNedsettelseIArbeidsevneMerEnnHalvpartenLabel,
  erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
  erSkadeSykdomEllerLyteVesentligdelLabel,
  harSkadeSykdomEllerLyteLabel,
  vilkårsvurderingLabel,
  yrkesskadeBegrunnelse,
} from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingFormInput';
import { Dato } from 'lib/types/Dato';
import { Sykdomvurdering } from 'lib/types/types';

interface Props {
  vurdering: Sykdomvurdering;
  sykdomUtenVissVarighetToggle: boolean;
}

export const TidligereSykdomsvurdering = ({ vurdering, sykdomUtenVissVarighetToggle }: Props) => {
  return (
    <VStack gap="space-20">
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
      {!sykdomUtenVissVarighetToggle && vurdering.erArbeidsevnenNedsatt !== undefined && (
        <SpørsmålOgSvar
          spørsmål={harNedsattArbeidsevneLabel}
          svar={getJaNeiEllerIkkeBesvart(vurdering.erArbeidsevnenNedsatt)}
        />
      )}
      {sykdomUtenVissVarighetToggle && vurdering.harNedsattArbeidsevne !== undefined && (
        <SpørsmålOgSvar
          spørsmål={erNedsettelseIArbeidsevneMerEnnHalvpartenLabel}
          svar={getJaNeiJaForbigåendeEllerIkkeBesvart(vurdering.harNedsattArbeidsevne)}
        />
      )}
      {vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten !== undefined && (
        <SpørsmålOgSvar
          spørsmål={erNedsettelseIArbeidsevneMerEnnHalvpartenLabel}
          svar={getJaNeiEllerIkkeBesvart(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten)}
        />
      )}
      {!!vurdering.yrkesskadeBegrunnelse && (
        <SpørsmålOgSvar spørsmål={yrkesskadeBegrunnelse} svar={vurdering.yrkesskadeBegrunnelse} />
      )}
      {vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense !== undefined && (
        <SpørsmålOgSvar
          spørsmål={erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense}
          svar={getJaNeiEllerIkkeBesvart(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense)}
        />
      )}
      {vurdering.erSkadeSykdomEllerLyteVesentligdel !== undefined && (
        <SpørsmålOgSvar
          spørsmål={erSkadeSykdomEllerLyteVesentligdelLabel}
          svar={getJaNeiEllerIkkeBesvart(vurdering.erSkadeSykdomEllerLyteVesentligdel)}
        />
      )}
      {!sykdomUtenVissVarighetToggle && vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet !== undefined && (
        <SpørsmålOgSvar
          spørsmål={erNedsettelseIArbeidsevneAvEnVissVarighetLabel}
          svar={getJaNeiEllerIkkeBesvart(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet)}
        />
      )}{' '}
    </VStack>
  );
};
