'use client';

import { SvarFraAndreinstansGrunnlag, SvarFraAndreinstansVurdering } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterSvartype, formaterUtfall } from 'lib/utils/svarfraandreinstans';
import { hjemmelMap } from 'lib/utils/hjemmel';

type Props = {
  grunnlag: SvarFraAndreinstansGrunnlag;
};

const mapResultatTilTeskst = (vurdering: SvarFraAndreinstansVurdering): string => {
  if (vurdering.konsekvens === 'INGENTING') {
    return 'Vedtaket opprettholdes / ingen endring';
  } else if (vurdering.konsekvens === 'BEHANDLE_PÅ_NYTT') {
    return 'Klagen må vurderes på nytt';
  } else if (vurdering.konsekvens === 'OMGJØRING') {
    return 'Vedtaket omgjøres helt eller delvis';
  }
  return 'Ukjent konsekvenskode';
};

export const KabalIverksettKonsekvens = ({ grunnlag }: Props) => (
  <VilkårsKort heading={'Oppsummering'} steg={'IVERKSETT_KONSEKVENS'}>
    <VStack gap={'4'}>
      <HStack gap="2">
        <BodyShort weight="semibold">Svartype fra Kabal:</BodyShort>
        <BodyShort>{formaterSvartype(grunnlag.svarFraAndreinstans.type)}</BodyShort>
      </HStack>
      <HStack gap="2">
        <BodyShort weight="semibold">Utfall:</BodyShort>
        <BodyShort>
          {grunnlag.svarFraAndreinstans.utfall && formaterUtfall(grunnlag.svarFraAndreinstans.utfall)}
        </BodyShort>
      </HStack>
      {grunnlag.svarFraAndreinstans.feilregistrertBegrunnelse != null &&
        grunnlag.svarFraAndreinstans.feilregistrertBegrunnelse != '' && (
          <HStack gap="2">
            <BodyShort weight="semibold">Begrunnelse for feilregistrering:</BodyShort>
            <BodyShort>{grunnlag.svarFraAndreinstans.feilregistrertBegrunnelse}</BodyShort>
          </HStack>
        )}
      <HStack gap="2">
        <BodyShort weight="semibold">Kommentar:</BodyShort>
        <BodyShort>{grunnlag.gjeldendeVurdering?.begrunnelse}</BodyShort>
      </HStack>
      {grunnlag.gjeldendeVurdering != null && (
        <HStack gap="2">
          <BodyShort weight="semibold">Resultat av klagebehandling:</BodyShort>
          <BodyShort>{mapResultatTilTeskst(grunnlag.gjeldendeVurdering)}</BodyShort>
        </HStack>
      )}
      {grunnlag.gjeldendeVurdering?.konsekvens === 'OMGJØRING' && (
        <HStack gap="2">
          <BodyShort weight="semibold">Vilkår som omgjøres:</BodyShort>
          <BodyShort>
            {grunnlag.gjeldendeVurdering.vilkårSomOmgjøres.map((vilkår) => hjemmelMap[vilkår]).join(', ')}
          </BodyShort>
        </HStack>
      )}
    </VStack>
  </VilkårsKort>
);
