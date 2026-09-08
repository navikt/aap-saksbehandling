import { PencilIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Label, Modal, Table, VStack } from '@navikt/ds-react';
import { SamordningGraderingFormfields } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { ValuePair } from 'components/form/FormField';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SamordningYtelsestype } from 'lib/types/types';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { useState } from 'react';
import { useForm, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { beregnForhåndsvisning } from 'components/behandlinger/samordning/samordninggradering/beregnForhåndsvisning';

import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  form: UseFormReturn<SamordningGraderingFormfields>;
  readOnly: boolean;
  fieldArray: UseFieldArrayReturn<SamordningGraderingFormfields, 'vurderteSamordninger'>;
}

type SamordnetYtelse = SamordningGraderingFormfields['vurderteSamordninger'][number];
type SamordnetYtelseMedIndeks = SamordnetYtelse & { _index: number };

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

function ytelseLabel(ytelseType: SamordningYtelsestype | undefined) {
  return ytelsesoptions.find((ytelse) => ytelse.value === ytelseType)?.label ?? '';
}

function tilTall(verdi: unknown): number | undefined {
  if (verdi === null || verdi === undefined || `${verdi}`.trim() === '') {
    return undefined;
  }
  const tall = Number(verdi);
  return Number.isNaN(tall) ? undefined : tall;
}

type ModalTilstand = { modus: 'ny' } | { modus: 'rediger'; indeks: number };

export const Ytelsesvurderinger = ({ form, readOnly, fieldArray }: Props) => {
  const { remove, append, update } = fieldArray;
  const [modalTilstand, setModalTilstand] = useState<ModalTilstand | null>(null);

  const rader = form.watch('vurderteSamordninger') ?? [];
  const raderMedIndeks: SamordnetYtelseMedIndeks[] = rader.map((rad, index) => ({ ...rad, _index: index }));
  const utfylteRader = raderMedIndeks.filter((rad) => rad.ytelseType && rad.periode.fom && rad.periode.tom);
  const forhåndsvisning = beregnForhåndsvisning(utfylteRader);

  function lagreRad(verdier: SamordnetYtelse) {
    const rad = { ...verdier, gradering: tilTall(verdier.gradering), manuell: true };

    if (modalTilstand?.modus === 'rediger') {
      update(modalTilstand.indeks, rad);
    } else {
      append(rad);
    }
    setModalTilstand(null);
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
        </VStack>
        <VStack gap={'space-8'}>
          <TableStyled aria-label="Perioder med samordning">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell>Ytelse</Table.HeaderCell>
                <Table.HeaderCell>Samordningsgrad (%)</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(() => {
                const alleredeVist = new Set<number>();
                return forhåndsvisning.map((rad, index) => {
                  const erFørsteVisningAvRad = !alleredeVist.has(rad._index);
                  alleredeVist.add(rad._index);
                  return (
                    <Table.Row key={index}>
                      <Table.DataCell>
                        {rad.periode.fom} - {rad.periode.tom}
                      </Table.DataCell>
                      <Table.DataCell>{ytelseLabel(rad.ytelseType)}</Table.DataCell>
                      <Table.DataCell>{rad.gradering}</Table.DataCell>
                      <Table.DataCell>
                        {erFørsteVisningAvRad && (
                          <HStack gap={'space-4'}>
                            <Button
                              size={'small'}
                              icon={<PencilIcon title={'Rediger'} />}
                              variant={'tertiary'}
                              type={'button'}
                              onClick={() => setModalTilstand({ modus: 'rediger', indeks: rad._index })}
                              disabled={readOnly}
                            />
                            <Button
                              size={'small'}
                              icon={<TrashIcon title={'Slett'} />}
                              variant={'tertiary'}
                              type={'button'}
                              onClick={() => remove(rad._index)}
                              disabled={readOnly}
                            />
                          </HStack>
                        )}
                      </Table.DataCell>
                    </Table.Row>
                  );
                });
              })()}
            </Table.Body>
          </TableStyled>
          <HStack gap={'space-8'}>
            <Button
              size={'small'}
              type={'button'}
              variant={'tertiary'}
              icon={<PlusCircleIcon />}
              onClick={() => setModalTilstand({ modus: 'ny' })}
              disabled={readOnly}
            >
              Legg til
            </Button>
          </HStack>
        </VStack>
      </VStack>
      {modalTilstand && (
        <RedigerYtelseModal
          initialValues={modalTilstand.modus === 'rediger' ? rader[modalTilstand.indeks] : undefined}
          onLagre={lagreRad}
          onLukk={() => setModalTilstand(null)}
        />
      )}
    </Box>
  );
};

const tomRad: SamordnetYtelse = {
  ytelseType: undefined,
  periode: { fom: '', tom: '' },
  gradering: undefined,
};

interface RedigerYtelseModalProps {
  initialValues?: SamordnetYtelse;
  onLagre: (verdier: SamordnetYtelse) => void;
  onLukk: () => void;
}

function RedigerYtelseModal({ initialValues, onLagre, onLukk }: RedigerYtelseModalProps) {
  const radForm = useForm<SamordnetYtelse>({ defaultValues: initialValues ?? tomRad });

  return (
    <Modal open onClose={onLukk} header={{ heading: initialValues ? 'Rediger periode' : 'Legg til periode' }} width={'medium'}>
      <Modal.Body>
        <HStack align={'end'} gap={'space-4'} wrap={false}>
          <DateInputWrapper
            label="Fra og med"
            control={radForm.control}
            name={'periode.fom'}
            rules={{
              required: 'Du må velge dato for periodestart',
              validate: {
                gyldigDato: (value) => validerDato(value as string),
                ikkeFoerStart: (value, formValues) =>
                  value && erDatoFoerDato(formValues.periode.tom, value as string)
                    ? 'Fra og med dato kan ikke være etter til og med dato'
                    : undefined,
              },
            }}
          />
          <DateInputWrapper
            label="Til og med"
            control={radForm.control}
            name={'periode.tom'}
            rules={{
              required: 'Du må velge dato for periodeslutt',
              validate: (value) => validerDato(value as string),
            }}
          />
          <SelectWrapper
            label="Ytelsestype"
            size={'small'}
            control={radForm.control}
            name={'ytelseType'}
            rules={{ required: 'Du må velge en ytelsetype' }}
          >
            {ytelsesoptions.map((ytelse, index) => (
              <option value={ytelse.value} key={index}>
                {ytelse.label}
              </option>
            ))}
          </SelectWrapper>
          <TextFieldWrapper
            name={'gradering'}
            label={'Utbetalingsgrad'}
            type={'text'}
            size={'small'}
            control={radForm.control}
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
        </HStack>
      </Modal.Body>
      <Modal.Footer>
        <Button size={'small'} type={'button'} onClick={radForm.handleSubmit(onLagre)}>
          {initialValues ? 'Lagre endringer' : 'Legg til periode'}
        </Button>
        <Button size={'small'} type={'button'} variant={'secondary'} onClick={onLukk}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

