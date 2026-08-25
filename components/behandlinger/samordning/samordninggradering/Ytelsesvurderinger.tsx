import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { SamordningGraderingFormfields } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { ValuePair } from 'components/form/FormField';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SamordningYtelsestype } from 'lib/types/types';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { useEffect, useRef, useState } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import styles from 'components/behandlinger/samordning/samordninggradering/YtelseTabell.module.css';
import { splittSykepengerVedFerie } from 'components/behandlinger/samordning/samordninggradering/splittSykepengerVedFerie';
import { TableStyled } from 'components/tablestyled/TableStyled';

const MARKERING_VARIGHET_MS = 10000;

interface Props {
  form: UseFormReturn<SamordningGraderingFormfields>;
  readOnly: boolean;
  fieldArray: UseFieldArrayReturn<SamordningGraderingFormfields, 'vurderteSamordninger'>;
}

const ytelsesoptions: ValuePair<SamordningYtelsestype | undefined>[] = [
  {
    value: undefined,
    label: 'Velg',
  },
  {
    value: 'SYKEPENGER',
    label: 'Sykepenger',
  },
  {
    value: 'FORELDREPENGER',
    label: 'Foreldrepenger',
  },
  {
    value: 'PLEIEPENGER',
    label: 'Pleiepenger',
  },
  {
    value: 'SVANGERSKAPSPENGER',
    label: 'Svangerskapspenger',
  },
  {
    value: 'OMSORGSPENGER',
    label: 'Omsorgspenger',
  },
  {
    value: 'OPPLÆRINGSPENGER',
    label: 'Opplæringspenger',
  },
  {
    value: 'FERIE_I_SYKEPENGEPERIODE',
    label: 'Ferie i sykepengeperiode',
  },
];

export const Ytelsesvurderinger = ({ form, readOnly, fieldArray }: Props) => {
  const { fields, remove, append, replace } = fieldArray;
  const [markerteRader, setMarkerteRader] = useState<number[]>([]);
  const markeringTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(markeringTimeout.current), []);

  function leggTilRad() {
    append({
      manuell: true,
      ytelseType: undefined,
      periode: { fom: '', tom: '' },
      gradering: undefined,
    });
  }

  function beregnSplittEtterFerie(ferieIndex: number) {
    const gjeldendeRader = form.getValues('vurderteSamordninger');

    if (gjeldendeRader[ferieIndex]?.ytelseType !== 'FERIE_I_SYKEPENGEPERIODE') {
      return;
    }

    const { rader, endredeIndekser } = splittSykepengerVedFerie(gjeldendeRader, ferieIndex);

    if (JSON.stringify(rader) === JSON.stringify(gjeldendeRader)) {
      return;
    }

    replace(rader);
    setMarkerteRader(endredeIndekser);
    clearTimeout(markeringTimeout.current);
    markeringTimeout.current = setTimeout(() => setMarkerteRader([]), MARKERING_VARIGHET_MS);
  }

  return (
    <Box>
      <VStack gap={'space-8'}>
        <VStack gap={'space-8'}>
          <Label size="small">Legg til perioder med samordning</Label>
          <BodyShort size="small">
            Legg til perioder med folketrygdytelser som skal samordnes med AAP etter § 11-27 / 11-28.
          </BodyShort>
          <BodyShort size="small">Grad skal settes ut fra en arbeidsevne på 37,5t.</BodyShort>
          <BodyShort size="small">
            100 % samordningsgrad vil gi stans av AAP i perioden etter § 11-27. Lavere prosent gir redusert ytelse.
          </BodyShort>
          <BodyShort size="small">
            Ferie fra sykepenger splitter opp eventuell sykepengeperiode i samme tidsrom.
          </BodyShort>
        </VStack>
        <VStack gap={'space-8'}>
          <TableStyled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell>Ytelse</Table.HeaderCell>
                <Table.HeaderCell>Samordningsgrad (%)</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fields.map((field, index) => (
                <Table.Row
                  key={field.id}
                  className={markerteRader.includes(index) ? styles.splittet : undefined}
                  data-splittet={markerteRader.includes(index) || undefined}
                  onBlur={(event) => {
                    if (event.currentTarget.contains(event.relatedTarget)) {
                      return;
                    }
                    beregnSplittEtterFerie(index);
                  }}
                >
                  <Table.DataCell>
                    <HStack align={'center'} gap={'space-4'}>
                      <DateInputWrapper
                        label="Fra og med"
                        control={form.control}
                        name={`vurderteSamordninger.${index}.periode.fom`}
                        hideLabel={true}
                        rules={{
                          required: 'Du må velge dato for periodestart',
                          validate: {
                            gyldigDato: (value) => validerDato(value as string),
                            ikkeFoerStart: (value, formValues) =>
                              value &&
                              erDatoFoerDato(formValues.vurderteSamordninger[index].periode.tom, value as string)
                                ? 'Fra og med dato kan ikke være etter til og med dato'
                                : undefined,
                          },
                        }}
                        readOnly={readOnly}
                      />
                      {'-'}
                      <DateInputWrapper
                        label="Til og med"
                        control={form.control}
                        name={`vurderteSamordninger.${index}.periode.tom`}
                        hideLabel={true}
                        rules={{
                          required: 'Du må velge dato for periodeslutt',
                          validate: (value) => {
                            return validerDato(value as string);
                          },
                        }}
                        readOnly={readOnly}
                      />
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>
                    <SelectWrapper
                      label="Ytelsestype"
                      size={'small'}
                      hideLabel
                      control={form.control}
                      readOnly={readOnly}
                      name={`vurderteSamordninger.${index}.ytelseType`}
                      rules={{ required: 'Du må velge en ytelsetype' }}
                    >
                      {ytelsesoptions.map((ytelse, index) => (
                        <option value={ytelse.value} key={index}>
                          {ytelse.label}
                        </option>
                      ))}
                    </SelectWrapper>
                  </Table.DataCell>
                  <Table.DataCell>
                    <TextFieldWrapper
                      name={`vurderteSamordninger.${index}.gradering`}
                      label={'Utbetalingsgrad'}
                      hideLabel
                      type={'text'}
                      size={'small'}
                      className={styles.utbetalingsgrad}
                      control={form.control}
                      readOnly={readOnly}
                      rules={{
                        required: 'Du må velge utbetalingsgrad',
                        validate: (value) => {
                          if (Number.isNaN(Number(value))) {
                            return 'Prosent må angis med siffer';
                          }
                          if (Number(value) < 0) {
                            return 'Utbetalingsgrad kan ikke være mindre enn 0%';
                          }
                          if (Number(value) > 100) {
                            return 'Utbetalingsgrad kan ikke være mer enn 100%';
                          }
                        },
                      }}
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
