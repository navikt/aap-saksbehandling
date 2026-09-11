import { PencilIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { SamordningGraderingFormfields } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import {
  RedigerYtelseModal,
  SamordnetYtelse,
  ytelseLabel,
} from 'components/behandlinger/samordning/samordninggradering/RedigerYtelseModal';
import { useState } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { medAutoSplitt } from 'components/behandlinger/samordning/samordninggradering/beregnForhåndsvisning';
import { useFeatureFlag } from 'context/UnleashContext';

import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  form: UseFormReturn<SamordningGraderingFormfields>;
  readOnly: boolean;
  fieldArray: UseFieldArrayReturn<SamordningGraderingFormfields, 'vurderteSamordninger'>;
}

type SamordnetYtelseMedIndeks = SamordnetYtelse & { _index: number };

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
  const autoSplittSykepenger = useFeatureFlag('autoSplittSykepenger');
  const [modalTilstand, setModalTilstand] = useState<ModalTilstand | null>(null);

  const rader = form.watch('vurderteSamordninger') ?? [];
  const raderMedIndeks: SamordnetYtelseMedIndeks[] = rader.map((rad, index) => ({ ...rad, _index: index }));
  const utfylteRader = raderMedIndeks.filter((rad) => rad.ytelseType && rad.periode.fom && rad.periode.tom);
  const forhåndsvisning = medAutoSplitt(utfylteRader, autoSplittSykepenger);

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
