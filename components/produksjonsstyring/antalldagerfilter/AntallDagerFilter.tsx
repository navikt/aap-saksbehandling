import { Chips, VStack } from '@navikt/ds-react';
import { OppslagsPeriode } from '../../../lib/types/statistikkTypes';

interface Props {
  selectedValue: number;
  onChange: (value: number) => void;
}

export const periodeOptions = [
  { label: 'I dag', value: 0, oppslagsPeriode: 'IDAG' as OppslagsPeriode },
  { label: 'I går', value: 1, oppslagsPeriode: 'IGÅR' as OppslagsPeriode },
  { label: 'Denne uken', value: 2, oppslagsPeriode: 'DENNE_UKEN' as OppslagsPeriode },
  { label: 'Forrige uke', value: 3, oppslagsPeriode: 'FORRIGE_UKE' as OppslagsPeriode },
];

export const AntallDagerFilter = ({ selectedValue, onChange }: Props) => (
  <VStack gap="10">
    <Chips>
      {periodeOptions.map(({ label, value }) => (
        <Chips.Toggle key={value} selected={selectedValue === value} onClick={() => onChange(value)}>
          {label}
        </Chips.Toggle>
      ))}
    </Chips>
  </VStack>
);
