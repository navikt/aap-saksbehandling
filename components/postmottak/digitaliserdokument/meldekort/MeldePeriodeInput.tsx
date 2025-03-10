import { Button, DatePicker, HStack, Table, TextField, VStack } from '@navikt/ds-react';
import { PliktDag, PliktkortFormFields } from './DigitaliserMeldekort';
import { add, format } from 'date-fns';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';
import styles from './MeldePeriodeInput.module.css';
import { TrashFillIcon, PencilFillIcon } from '@navikt/aksel-icons';

interface Props {
  form: UseFormReturn<PliktkortFormFields>;
  dagIndex: number;
  readOnly: boolean;
  slettPeriode: (index: number) => void;
}
export const MeldePeriodeInput = ({ form, dagIndex, readOnly, slettPeriode }: Props) => {
  const [isVelgDatoÅpen, setIsVelgDatoÅpen] = useState<boolean>(false);
  const [valgtDato, setValgtDato] = useState<Date>();
  const { fields, update } = useFieldArray({
    name: `pliktPerioder.${dagIndex}.dager`,
    control: form.control,
  });
  useEffect(() => {
    if (valgtDato) {
      fields.forEach((dag, index) => {
        update(index, { ...dag, dato: add(valgtDato, { days: index }) });
      });
    }
  }, [valgtDato]);
  const erAnnenDagEnnMandag = [(date: Date) => date.getDay() !== 1];
  const erDatoValgt = fields.every((e) => e.dato);
  return (
    <VStack padding={'4'} gap={'2'} className={styles.pliktPeriodeInput}>
      <HStack justify={'space-between'}>
        <Button
          icon={<PencilFillIcon />}
          variant={'secondary'}
          type={'button'}
          size={'small'}
          onClick={() => setIsVelgDatoÅpen((x) => !x)}
        >
          {erDatoValgt ? 'Endre dato for perioden' : 'Velg dato for perioden'}
        </Button>
        <Button
          icon={<TrashFillIcon />}
          size={'small'}
          type={'button'}
          variant={'secondary'}
          onClick={() => slettPeriode(dagIndex)}
          disabled={readOnly}
        />
      </HStack>
      <DatePicker
        today={new Date()}
        disabled={erAnnenDagEnnMandag || readOnly}
        onSelect={(val) => {
          setValgtDato(val);
          setIsVelgDatoÅpen(false);
        }}
        open={isVelgDatoÅpen}
        onClose={() => setIsVelgDatoÅpen(false)}
      />
      {erDatoValgt && (
        <Table size={'small'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              {fields?.map((pliktDag: PliktDag, j) => (
                <Table.HeaderCell key={j}>
                  {pliktDag.dato ? format(pliktDag.dato, 'dd.MM.') : 'velg dato'}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>Arbeidstimer</Table.DataCell>
              {fields?.map((pliktDag: PliktDag, i) => (
                <Table.DataCell key={i}>
                  <TextField
                    label={'Arbeidstimer'}
                    hideLabel={true}
                    type={'number'}
                    onChange={(event) => update(i, { ...pliktDag, arbeidsTimer: Number(event.target.value) })}
                    size={'small'}
                    disabled={readOnly}
                  />
                </Table.DataCell>
              ))}
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </VStack>
  );
};
