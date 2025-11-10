import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, HStack, Table, VStack } from '@navikt/ds-react';

import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

import { validerNullableDato } from 'lib/validation/dateValidation';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { clientHentAlleNavenheter } from 'lib/clientApi';
import { isError } from 'lib/utils/api';

import { FormFields } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isBefore, startOfDay } from 'date-fns';
import { stringToDate } from 'lib/utils/date';
import { Sak } from 'context/saksbehandling/SakContext';

interface Props {
  sak: Sak;
  form: UseFormReturn<FormFields>;
  readOnly: boolean;
}

export const RefusjonsKrav = ({ sak, form, readOnly }: Props) => {
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
        <BodyLong size={'small'} weight={'semibold'}>
          Legg til refusjonskrav
        </BodyLong>
        <BodyLong size="small" textColor={'subtle'}>
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
                <Table.HeaderCell>Fra dato</Table.HeaderCell>
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
                        label="Refusjonen gjelder fra"
                        control={form.control}
                        name={`refusjoner.${index}.fom`}
                        hideLabel={true}
                        rules={{
                          validate: {
                            gyldigDato: (value) => validerNullableDato(value as string),
                            kanIkkeVaereFoerSoeknadstidspunkt: (value) => {
                              const starttidspunkt = startOfDay(new Date(sak.periode.fom));
                              const vurderingGjelderFra = stringToDate(value as string, 'dd.MM.yyyy');
                              if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), starttidspunkt)) {
                                return 'Vurderingen kan ikke gjelde fra før starttidspunktet';
                              }
                              return true;
                            },
                          },
                        }}
                        readOnly={readOnly}
                      />
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>
                    <AsyncComboSearch
                      hideLabel={true}
                      label={'Søk opp Nav-kontor'}
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
