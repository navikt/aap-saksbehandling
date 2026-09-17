import { BodyShort, Label, List, VStack } from '@navikt/ds-react';
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
        <VStack gap={'space-8'}>
          <BodyShort size={'small'}>
            Har bruker planer om ferie før de er ferdige med sykepenger:{' '}
            {feriePerioder.length > 0 ? 'Ja' : `Ja, ${ferieDager} dager`}
          </BodyShort>

          <List size={'small'}>
            {feriePerioder.map((periode, index) => (
              <List.Item key={index}>{formaterFeriePerioder(periode)}</List.Item>
            ))}
          </List>
        </VStack>
      )}
    </VStack>
  );
};

function formaterFeriePerioder(periode: Periode): string {
  return `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`;
}
