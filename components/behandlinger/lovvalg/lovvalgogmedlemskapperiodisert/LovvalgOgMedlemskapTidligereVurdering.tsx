import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { PeriodisertManuellVurderingForLovvalgMedlemskapResponse } from 'lib/types/types';

type Props = {
  vurdering: PeriodisertManuellVurderingForLovvalgMedlemskapResponse;
};

export const LovvalgOgMedlemskapTidligereVurdering = ({ vurdering }: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra" svar={formaterDatoForFrontend(vurdering.fom)} />
      <SpørsmålOgSvar spørsmål="Vurder riktig lovvalg" svar={vurdering.lovvalg.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål="Hva er riktig lovvalgsland?"
        svar={vurdering.lovvalg.lovvalgsEØSLandEllerLandMedAvtale}
      />
      {vurdering.medlemskap && (
        <>
          <SpørsmålOgSvar spørsmål="Vurder brukerens medlemskap" svar={vurdering.medlemskap.begrunnelse ?? ''} />
          <SpørsmålOgSvar
            spørsmål="Var brukeren medlem av folketrygden?"
            svar={vurdering.medlemskap.varMedlemIFolketrygd ? 'Ja' : 'Nei'}
          />
        </>
      )}
    </VStack>
  );
};

type SpørsmålOgSvarProps = {
  spørsmål: string;
  svar: string;
};

export const SpørsmålOgSvar = ({ spørsmål, svar }: SpørsmålOgSvarProps) => (
  <VStack gap="1">
    <Label size="small">{spørsmål}</Label>
    <BodyShort size="small">{svar}</BodyShort>
  </VStack>
);
