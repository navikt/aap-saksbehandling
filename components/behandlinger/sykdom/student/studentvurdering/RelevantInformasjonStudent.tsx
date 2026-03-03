import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { ErStudentStatus, SkalGjenopptaStudieStatus, StudentGrunnlag } from 'lib/types/types';

interface Props {
  opplysninger?: StudentGrunnlag['oppgittStudent'];
}

export const RelevantInformasjonStudent = ({ opplysninger }: Props) => {
  return (
    <VStack gap={'1'}>
      <Label size={'small'}>Relevant informasjon fra søknaden</Label>
      {opplysninger?.erStudentStatus && (
        <BodyShort size={'small'}>
          Er brukeren student: {mapErStudentStatusTilString(opplysninger.erStudentStatus)}
        </BodyShort>
      )}
      {opplysninger?.skalGjenopptaStudieStatus && opplysninger?.skalGjenopptaStudieStatus !== 'IKKE_OPPGITT' && (
        <BodyShort size={'small'}>
          Planlegger å gjenoppta studie: {mapSkalGjenopptaStudieStatus(opplysninger.skalGjenopptaStudieStatus)}
        </BodyShort>
      )}
    </VStack>
  );
};

function mapErStudentStatusTilString(status: ErStudentStatus): string {
  switch (status) {
    case 'JA':
      return 'Ja, helt eller delvis';
    case 'AVBRUTT':
      return 'Ja, men har avbrutt studiet helt på grunn av sykdom';
    case 'NEI':
      return 'Nei';
  }
  return '';
}

function mapSkalGjenopptaStudieStatus(status: SkalGjenopptaStudieStatus): string | undefined {
  switch (status) {
    case 'JA':
      return 'Ja';
    case 'VET_IKKE':
      return 'Brukeren vet ikke';
    case 'NEI':
      return 'Nei';
  }
}
