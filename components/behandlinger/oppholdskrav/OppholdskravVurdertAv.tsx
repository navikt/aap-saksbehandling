import { Detail, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

type Props = {
  navn?: string | null;
  ident: string;
  dato: string;
};

export const OppholdskravVurdertAv = ({ navn, ident, dato }: Props) => (
  <VStack align="end">
    <Detail>{`Vurdert av ${navn != null ? navn : ident}, ${formaterDatoForFrontend(dato)}`}</Detail>
  </VStack>
);
