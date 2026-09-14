import { PencilIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import {
  SamordnetYtelse,
  SamordningGraderingFormfields,
} from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import {
  RedigerYtelseModal,
  SamordnetYtelseFormFields,
  ytelsesoptions,
} from 'components/behandlinger/samordning/samordninggradering/RedigerYtelseModal';
import { useState } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useFeatureFlag } from 'context/UnleashContext';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { SamordningYtelsestype } from '/lib/types/types';
import { medAutoSplitt } from './beregnForhåndsvisning';

interface Props {
  form: UseFormReturn<SamordningGraderingFormfields>;
  readOnly: boolean;
  fieldArray: UseFieldArrayReturn<SamordningGraderingFormfields, 'vurderteSamordninger'>;
}

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

type ModalTilstand = { modus: 'ny' } | { modus: 'rediger'; index: number };

export const Ytelsesvurderinger = ({ form, readOnly, fieldArray }: Props) => {
  const { replace } = fieldArray;
  const autoSplittSykepenger = useFeatureFlag('autoSplittSykepenger');
  const [modalTilstand, setModalTilstand] = useState<ModalTilstand | null>(null);

  const rader = form.watch('vurderteSamordninger') ?? [];


  function lagreRad(verdier: SamordnetYtelseFormFields) {
    const rad: SamordnetYtelse = {
      periode: { fom: verdier.fom, tom: verdier.tom },
      gradering: tilTall(verdier.gradering),
      ytelseType: verdier.ytelseType,
      manuell: true,
    };
    const oppdaterArray = modalTilstand?.modus === 'rediger' ? rader.map((eksisterendeRad,index) => index === modalTilstand.index? rad : eksisterendeRad): [...rader, rad]
    const splittet = medAutoSplitt(oppdaterArray,autoSplittSykepenger);

    replace(splittet);
    setModalTilstand(null);
  }

  function fjerneRad(fjernetIndex: number) {
    const utenSlettetElement = rader.filter((rad, index) => index !== fjernetIndex);
    const splittet = medAutoSplitt(utenSlettetElement, autoSplittSykepenger);

    replace(splittet);
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
                return rader.map((rad, index) => {

                  return (
                    <Table.Row key={index}>
                      <Table.DataCell>
                        {rad.periode.fom} - {rad.periode.tom}
                      </Table.DataCell>
                      <Table.DataCell>{ytelseLabel(rad.ytelseType)}</Table.DataCell>
                      <Table.DataCell>{rad.gradering}</Table.DataCell>
                      <Table.DataCell>
                        <HStack gap={'space-4'}>
                          <Button
                            size={'small'}
                            icon={<PencilIcon title={'Rediger'} />}
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => setModalTilstand({ modus: 'rediger', index: index })}
                            disabled={readOnly}
                          />
                          <Button
                            size={'small'}
                            icon={<TrashIcon title={'Slett'} />}
                            variant={'tertiary'}
                            type={'button'}
                            onClick={() => fjerneRad(index)}
                            disabled={readOnly}
                          />
                        </HStack>
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
          initialValues={modalTilstand.modus === 'rediger' ? rader[modalTilstand.index] : undefined}
          onLagre={lagreRad}
          onLukk={() => setModalTilstand(null)}
        />
      )}
    </Box>
  );
};
