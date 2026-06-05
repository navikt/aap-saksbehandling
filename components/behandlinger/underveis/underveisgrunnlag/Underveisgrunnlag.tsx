'use client';

import { BodyShort, Chips, Table, VStack } from '@navikt/ds-react';
import { Diff, UnderveisAvslagsÅrsak, UnderveisGrunnlag, UnderveisGrunnlagMedDiff } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapUtfallTilTekst } from 'lib/utils/oversettelser';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { Behovstype } from 'lib/utils/form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami';
import React, { useState } from 'react';
import styles from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag.module.css';
import { Alert } from 'components/alert/Alert';

type Props = {
  grunnlag: UnderveisGrunnlag[];
  grunnlagMedDiff: UnderveisGrunnlagMedDiff;
  readOnly: boolean;
  behandlingVersjon: number;
  visMedDiff: boolean;
};
type PeriodeProps = {
  periode: UnderveisGrunnlag;
  bakgrunnClassName?: string;
};

export const Underveisgrunnlag = ({ grunnlag, grunnlagMedDiff, readOnly, behandlingVersjon, visMedDiff }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();

  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_UTTAK');
  const { visningModus, visningActions } = useVilkårskortVisning(readOnly, 'FASTSETT_UTTAK', undefined);
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  return (
    <VilkårskortMedForm
      heading="Underveis"
      steg={'FASTSETT_UTTAK'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      onSubmit={(event) => {
        event.preventDefault();
        løsBehovOgGåTilNesteSteg(
          {
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.FORESLÅ_UTTAK_KODE,
            },
            referanse: behandlingsreferanse,
          },
          () => {
            loggUmamiVarighet('STEG_UNDERVEIS_VARIGHET', umamiStartTidspunkt, Date.now());
          }
        );
      }}
      knappTekst={'Neste'}
      visningModus={visningModus}
      visningActions={visningActions}
    >
      {!visMedDiff && <UnderveisTabell grunnlag={grunnlag} />}
      {visMedDiff && <UnderveisTabellMedDiff grunnlag={grunnlagMedDiff} />}
      <VStack gap={'space-16'}>
        {!readOnly && <BodyShort>Trykk på neste steg for å komme videre.</BodyShort>}
        <LøsBehovOgGåTilNesteStegStatusAlert
          status={status}
          løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        />
      </VStack>
    </VilkårskortMedForm>
  );
};

const UnderveisTabell = ({ grunnlag }: { grunnlag: UnderveisGrunnlag[] }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Vurdert periode</Table.HeaderCell>
          <Table.HeaderCell>Utfall</Table.HeaderCell>
          <Table.HeaderCell>Avslagsårsak</Table.HeaderCell>
          <Table.HeaderCell>Gradering</Table.HeaderCell>
          <Table.HeaderCell>Trekk (dagsatser)</Table.HeaderCell>
          <Table.HeaderCell>Rettighetstype</Table.HeaderCell>
          <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.map((periode, index) => (
          <Perioderad key={index} periode={periode} />
        ))}
      </Table.Body>
    </Table>
  );
};
export const UnderveisTabellMedDiff = ({ grunnlag }: { grunnlag: UnderveisGrunnlagMedDiff }) => {
  const [visHistorikkPåEndredePerioder, setVisHistorikkPåEndredePerioder] = useState(false);
  const [visPerioderUtenEndringFraTidligere, setVisPerioderUtenEndringFraTidligere] = useState(false);

  const skalViseMeldingOmIngenEndringIPerioder =
    grunnlag.perioder.length > 0 && grunnlag.perioder.every((periode) => periode.diff === 'Uendret');
  return (
    <>
      <Chips size={'small'}>
        <Chips.Toggle
          type={'button'}
          onClick={() => {
            setVisHistorikkPåEndredePerioder(!visHistorikkPåEndredePerioder);
          }}
          selected={visHistorikkPåEndredePerioder}
        >
          Vis historikk på endrede perioder
        </Chips.Toggle>
        <Chips.Toggle
          type={'button'}
          onClick={() => {
            setVisPerioderUtenEndringFraTidligere(!visPerioderUtenEndringFraTidligere);
          }}
          selected={visPerioderUtenEndringFraTidligere}
        >
          Vis perioder uten endring fra tidligere behandling
        </Chips.Toggle>
      </Chips>
      {skalViseMeldingOmIngenEndringIPerioder && (
        <Alert variant={'info'}>Ingen nye eller endrede perioder siden forrige behandling</Alert>
      )}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Vurdert periode</Table.HeaderCell>
            <Table.HeaderCell>Utfall</Table.HeaderCell>
            <Table.HeaderCell>Avslagsårsak</Table.HeaderCell>
            <Table.HeaderCell>Gradering</Table.HeaderCell>
            <Table.HeaderCell>Trekk (dagsatser)</Table.HeaderCell>
            <Table.HeaderCell>Rettighetstype</Table.HeaderCell>
            <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.perioder.map((periode, periodeIndex) => {
            const nyPeriode = utledNyPeriode(periode);
            const uendretPeriode =
              visPerioderUtenEndringFraTidligere && periode.diff === 'Uendret' ? periode.uendret : null;
            const historiskPeriode = visHistorikkPåEndredePerioder ? utledHistoriskPeriode(periode) : null;

            return (
              <React.Fragment key={periodeIndex}>
                {nyPeriode && <Perioderad key={`ny-${periodeIndex}`} periode={nyPeriode} bakgrunnClassName={''} />}
                {historiskPeriode && (
                  <Perioderad
                    key={`historisk-${periodeIndex}`}
                    periode={historiskPeriode}
                    bakgrunnClassName={styles.tablerowhistoriskinnhold}
                  />
                )}
                {uendretPeriode && (
                  <Perioderad key={`uendret-${periodeIndex}`} periode={uendretPeriode} bakgrunnClassName={''} />
                )}
              </React.Fragment>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};

const Perioderad = ({ periode, bakgrunnClassName }: PeriodeProps) => {
  return (
    <Table.Row className={bakgrunnClassName}>
      <Table.HeaderCell>
        {formaterDatoForFrontend(periode.periode.fom)} - {formaterDatoForFrontend(periode.periode.tom)}
      </Table.HeaderCell>
      <Table.DataCell>{mapUtfallTilTekst(periode.utfall)}</Table.DataCell>
      <Table.DataCell>{periode.avslagsårsak && årsakTilString(periode.avslagsårsak)}</Table.DataCell>
      <Table.DataCell>
        <div>Gradering: {periode.gradering.gradering}%</div>
        <div>Andel arbeid: {periode.gradering.andelArbeid}%</div>
        <div>Fastsatt arbeidsevne: {periode.gradering.fastsattArbeidsevne}%</div>
        <div>Grenseverdi: {periode.gradering.grenseverdi}%</div>
      </Table.DataCell>
      <Table.DataCell>{periode.trekk.antall}</Table.DataCell>
      <Table.DataCell>{periode.rettighetsType?.hjemmel}</Table.DataCell>
      <Table.DataCell>
        {formaterDatoForFrontend(periode.meldePeriode.fom)} - {formaterDatoForFrontend(periode.meldePeriode.tom)}
      </Table.DataCell>
    </Table.Row>
  );
};

function årsakTilString(avslagsÅrsak: UnderveisAvslagsÅrsak): string {
  switch (avslagsÅrsak) {
    case 'IKKE_GRUNNLEGGENDE_RETT':
      return 'Ikke grunnleggende rett.';
    case 'MELDEPLIKT_FRIST_IKKE_PASSERT':
      return 'Meldepliktfrist ikke passert';
    case 'IKKE_OVERHOLDT_MELDEPLIKT_SANKSJON':
      return 'Ikke overhold meldeplikt sanksjon';
    case 'ARBEIDER_MER_ENN_GRENSEVERDI':
      return 'Arbeider mer enn grenseverdi';
    case 'SONER_STRAFF':
      return 'Soner straff';
    case 'VARIGHETSKVOTE_BRUKT_OPP':
      return 'Varighetskvote brukt opp';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_11_7_OPPHØR':
      return 'Brudd på aktivitetsplikt etter § 11-7 - Opphør';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_11_7_STANS':
      return 'Brudd på aktivitetsplikt etter § 11-7 - Stans';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_11_3_STANS':
      return 'Brudd på oppholdskrav etter § 11-3 - Stans';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_11_3_OPPHØR':
      return 'Brudd på oppholdskrav etter § 11-3 - Opphør';
    default:
      exhaustiveCheck(avslagsÅrsak);
  }
}

const utledNyPeriode = (periode: Diff<UnderveisGrunnlag>) => {
  switch (periode.diff) {
    case 'Endret':
      return periode.til;
    case 'LagtTil':
      return periode.lagtTil;
    case 'Fjernet':
    case 'Uendret':
      return null;
  }
};

const utledHistoriskPeriode = (periode: Diff<UnderveisGrunnlag>) => {
  switch (periode.diff) {
    case 'Endret':
      return periode.fra;
    case 'Fjernet':
      return periode.fjernet;
    case 'LagtTil':
    case 'Uendret':
      return null;
  }
};
