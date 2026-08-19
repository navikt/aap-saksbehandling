import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { Periode, SamordningGraderingGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
}

export const RelevantInformasjonSamordningGradering = ({ grunnlag }: Props) => {
  const { mottarSykepenger, feriePerioder, ferieDager } = grunnlag;

  const visFerie = feriePerioder.length > 0 || !!ferieDager;

  if (mottarSykepenger == null && !visFerie) {
    return null;
  }

  return (
    <VStack gap={'space-4'}>
      <Label size={'small'}>Relevant informasjon fra søknaden</Label>
      {mottarSykepenger != null && (
        <BodyShort size={'small'}>Mottar bruker sykepenger: {mottarSykepenger ? 'Ja' : 'Nei'}</BodyShort>
      )}
      {visFerie && (
        <BodyShort size={'small'}>
          Har bruker planer om ferie før de er ferdige med sykepenger:{' '}
          {feriePerioder.length > 0 ? `Ja, ${formaterFeriePerioder(feriePerioder)}` : `Ja, ${ferieDager} dager`}
        </BodyShort>
      )}
    </VStack>
  );
};

function formaterFeriePerioder(feriePerioder: Periode[]): string {
  return feriePerioder
    .map((periode) => `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`)
    .join(', ');
}
