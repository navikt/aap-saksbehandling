import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Label, Table, VStack } from '@navikt/ds-react';
import {
  SamordnetYtelse,
  SamordningGraderingFormfields,
} from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import {
  FerieFormFields,
  FerieISykepengeperiodeModal,
} from 'components/behandlinger/samordning/samordninggradering/FerieISykepengeperiodeModal';
import { FerieISykepengeperiodeRad } from 'components/behandlinger/samordning/samordninggradering/FerieISykepengeperiodeRad';
import { YtelsesvurderingRad } from 'components/behandlinger/samordning/samordninggradering/YtelsesvurderingRad';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { ValuePair } from 'components/form/FormField';
import { SamordningGraderingGrunnlag, SamordningYtelsestype } from 'lib/types/types';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { beregnSplittingAvSykepengeperiode, slåSammenSplittedeSykepengeperioder } from 'components/behandlinger/samordning/samordninggradering/beregnSplittingAvSykepengeperiode';

interface Props {
  form: UseFormReturn<SamordningGraderingFormfields>;
  readOnly: boolean;
  fieldArray: UseFieldArrayReturn<SamordningGraderingFormfields, 'vurderteSamordninger'>;
  grunnlag: SamordningGraderingGrunnlag;
}

export const ytelsesoptions: ValuePair<SamordningYtelsestype | undefined>[] = [
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

// "Ferie i sykepengeperiode" kan kun opprettes/redigeres via FerieISykepengeperiodeModal, siden
// lagring der trigger en omberegning (splitting) av sykepengeperiodene. Denne skal derfor ikke
// være valgbar i den vanlige, radvise ytelsestype-velgeren.
const ytelsesoptionerUtenFerie = ytelsesoptions.filter((ytelse) => ytelse.value !== 'FERIE_I_SYKEPENGEPERIODE');

function ytelseLabel(ytelseType: SamordningYtelsestype | undefined) {
  return ytelsesoptions.find((ytelse) => ytelse.value === ytelseType)?.label ?? '';
}

type ModalTilstand = { modus: 'ny' } | { modus: 'rediger'; index: number };

export const Ytelsesvurderinger = ({ form, readOnly, fieldArray, grunnlag }: Props) => {
  const { fields, append, remove, replace } = fieldArray;
  const [modalTilstand, setModalTilstand] = useState<ModalTilstand | null>(null);
  const [ferieFeilmelding, setFerieFeilmelding] = useState<string>();

  const rader = form.watch('vurderteSamordninger') ?? [];

  function leggTilRad() {
    append({
      manuell: true,
      ytelseType: undefined,
      periode: { fom: '', tom: '' },
      gradering: undefined,
    });
  }

  async function åpneFerieModal() {
    const erGyldig = await form.trigger('vurderteSamordninger');

    if (!erGyldig) {
      setFerieFeilmelding('Du må rette opp feilene i tabellen før du kan legge til ferie i sykepengeperioden.');
      return;
    }

    setFerieFeilmelding(undefined);
    setModalTilstand({ modus: 'ny' });
  }

  /**
   * Når en ferieperiode legges til, redigeres eller slettes må sykepengeperiodene alltid
   * rekonstrueres til sin opprinnelige, usplittede form (basert på ferieperiodene slik de var
   * *før* endringen) før den nye/endrede ferien splittes inn på nytt. Uten dette steget vil
   * f.eks. en innsnevret eller slettet ferieperiode etterlate et udekket "hull" i periodene,
   * siden gapet mellom tidligere splittede sykepengerader ikke lenger dekkes fullt ut av den
   * (nye, mindre) ferieperioden og dermed ikke slås sammen igjen.
   */
  function gjenopprettFørOmberegning(): SamordnetYtelse[] {
    return slåSammenSplittedeSykepengeperioder(rader);
  }

  function lagreFerieRad(verdier: FerieFormFields) {
    const rad: SamordnetYtelse = {
      periode: { fom: verdier.fom, tom: verdier.tom },
      gradering: 100,
      ytelseType: 'FERIE_I_SYKEPENGEPERIODE',
      manuell: true,
    };

    const eksisterendeFerieRad = modalTilstand?.modus === 'rediger' ? rader[modalTilstand.index] : undefined;
    const gjenopprettetArray = gjenopprettFørOmberegning();

    const oppdatertArray = eksisterendeFerieRad
      ? gjenopprettetArray.map((eksisterende) => (eksisterende === eksisterendeFerieRad ? rad : eksisterende))
      : [...gjenopprettetArray, rad];

    const splittet = beregnSplittingAvSykepengeperiode(oppdatertArray);

    replace(splittet);
    setModalTilstand(null);
  }

  function fjerneFerieRad(fjernetIndex: number) {
    const fjernetRad = rader[fjernetIndex];
    const gjenopprettetArray = gjenopprettFørOmberegning();
    const utenSlettetElement = gjenopprettetArray.filter((rad) => rad !== fjernetRad);

    const splittet = beregnSplittingAvSykepengeperiode(utenSlettetElement);

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
              {fields.map((field, index) => {
                const erFerieISykepengeperiode = field?.ytelseType === 'FERIE_I_SYKEPENGEPERIODE';

                if (erFerieISykepengeperiode) {
                  return (
                    <FerieISykepengeperiodeRad
                      key={field.id}
                      rad={field}
                      ytelseLabel={ytelseLabel(field.ytelseType)}
                      readOnly={readOnly}
                      onRediger={() => setModalTilstand({ modus: 'rediger', index: index })}
                      onSlett={() => fjerneFerieRad(index)}
                    />
                  );
                }

                return (
                  <YtelsesvurderingRad
                    key={field.id}
                    form={form}
                    index={index}
                    readOnly={readOnly}
                    ytelsesoptioner={ytelsesoptionerUtenFerie}
                    onSlett={() => remove(index)}
                  />
                );
              })}
            </Table.Body>
          </TableStyled>
          {ferieFeilmelding && <Alert variant={'error'}>{ferieFeilmelding}</Alert>}
          <HStack gap={'space-8'}>
            <Button
              size={'small'}
              type={'button'}
              variant={'tertiary'}
              icon={<PlusCircleIcon />}
              onClick={leggTilRad}
              disabled={readOnly}
            >
              Legg til periode
            </Button>
            <Button
              size={'small'}
              type={'button'}
              variant={'tertiary'}
              icon={<PlusCircleIcon />}
              onClick={åpneFerieModal}
              disabled={readOnly}
            >
              Legg til ferie i sykepengeperiode
            </Button>
          </HStack>
        </VStack>
      </VStack>
      {modalTilstand && (
        <FerieISykepengeperiodeModal
          grunnlag={grunnlag}
          initialValues={modalTilstand.modus === 'rediger' ? rader[modalTilstand.index]?.periode : undefined}
          onLagre={lagreFerieRad}
          onLukk={() => setModalTilstand(null)}
        />
      )}
    </Box>
  );
};
