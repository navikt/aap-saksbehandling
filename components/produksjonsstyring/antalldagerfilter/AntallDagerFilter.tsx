import { Chips, VStack } from '@navikt/ds-react';

interface Props {
  selectedValue: number;
  onChange: (value: number) => void;
}

const options = [
  { label: 'I dag', value: 0 },
  { label: 'I går', value: 1 },
  { label: 'Denne uken', value: 2 },
  { label: 'Forrige uke', value: 3 },
];

export const AntallDagerFilter = ({ selectedValue, onChange }: Props) => (
  <VStack gap="10">
    <Chips>
      {options.map(({ label, value }) => (
        <Chips.Toggle key={value} selected={selectedValue === value} onClick={() => onChange(value)}>
          {label}
        </Chips.Toggle>
      ))}
    </Chips>
  </VStack>
);
