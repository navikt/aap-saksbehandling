import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Box, Button, HStack, Table, VStack } from '@navikt/ds-react';

import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

import { validerDato } from 'lib/validation/dateValidation';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { clientHentAlleNavenheter } from 'lib/clientApi';
import { isError } from 'lib/utils/api';

import { FormFields } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import styles from './Refusjon.module.css';

interface Props {
  form: UseFormReturn<FormFields>;
  readOnly: boolean;
}

export const RefusjonsKrav = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ name: 'refusjoner', control: form.control });
  const behandlingsreferanse = useBehandlingsReferanse();

  const kontorSøk = async (input: string) => {
    if (input.length <= 2) {
      return [];
    }

    const response = await clientHentAlleNavenheter(behandlingsreferanse, { navn: input });
    if (isError(response)) {
      return [];
    }

    return response.data.map((kontor) => ({
      label: `${kontor.navn} - ${kontor.enhetsnummer}`,
      value: `${kontor.navn} - ${kontor.enhetsnummer}`,
    }));
  };

  function leggTilRad() {
    append({
      navKontor: { label: '', value: '' },
      fom: '',
      tom: '',
    });
  }

  return (
    <Box>
      <VStack gap={'4'}>
        <BodyShort className={styles.refusjonTekstHeader}>Legg til refusjonskrav</BodyShort>
        <BodyLong size="small" className={styles.refusjonKravTekst}>
          Hvis det er flere kontorer som kan ha refusjonskrav, legg til flere perioder.
          <br />
          Sluttdato på periode blir dagen før vedtaksdato med mindre annet er oppgitt.
          <br />
          Refusjonskrav vil kun være på etterbetaling av AAP.
        </BodyLong>
      </VStack>

      <VStack gap={'2'}>
        <VStack gap={'2'}>
          <TableStyled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell>Kontor</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fields.map((_, index) => (
                <Table.Row key={index}>
                  <Table.DataCell>
                    <HStack align={'center'} gap={'1'}>
                      <DateInputWrapper
                        label="Fra og med"
                        control={form.control}
                        name={`refusjoner.${index}.fom`}
                        hideLabel={true}
                        rules={{
                          required: 'Du må velge dato for start',
                          validate: (value) => {
                            return validerDato(value as string);
                          },
                        }}
                        readOnly={readOnly}
                      />
                      {'-'}
                      <DateInputWrapper
                        label="Til og med"
                        control={form.control}
                        name={`refusjoner.${index}.tom`}
                        hideLabel={true}
                        readOnly={readOnly}
                      />
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>
                    <AsyncComboSearch
                      label={''}
                      form={form}
                      name={`refusjoner.${index}.navKontor`}
                      fetcher={kontorSøk}
                      rules={{
                        validate: {
                          valgtKontor: (value) => {
                            if (!value) return 'Du må velge et Nav-kontor';
                            if (typeof value === 'object' && 'value' in value) {
                              return value.value?.trim() ? true : 'Du må velge et Nav-kontor';
                            }
                          },
                        },
                      }}
                      size={'small'}
                      readOnly={readOnly}
                    />
                  </Table.DataCell>
                  <Table.DataCell>
                    <Button
                      size={'small'}
                      icon={<TrashIcon title={'Slett'} />}
                      variant={'tertiary'}
                      type={'button'}
                      onClick={() => remove(index)}
                      disabled={readOnly}
                    />
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </TableStyled>
          <HStack>
            <Button
              size={'small'}
              type={'button'}
              variant={'tertiary'}
              icon={<PlusCircleIcon />}
              onClick={leggTilRad}
              disabled={readOnly}
            >
              Legg til
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};
