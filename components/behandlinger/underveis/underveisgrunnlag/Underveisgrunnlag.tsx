'use client';

import { BodyShort, InlineMessage, Table } from '@navikt/ds-react';
import { RettighetDto, UnderveisAvslagsÅrsak, UnderveisGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapUtfallTilTekst } from 'lib/utils/oversettelser';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFeatureFlag } from 'context/UnleashContext';
import styles from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak.module.css';

type Props = {
  grunnlag: UnderveisGrunnlag[];
  readOnly: boolean;
  behandlingVersjon: number;
  rettighetsdata: RettighetDto[];
};

const Perioderad = ({
  periode,
  rettighetsdata,
  isVisRettigheterForVedtakEnabled,
}: {
  periode: UnderveisGrunnlag;
  rettighetsdata: RettighetDto[];
  isVisRettigheterForVedtakEnabled: boolean;
}) => {
  const gjenværendeKvote =
    periode.utfall === 'OPPFYLT'
      ? (rettighetsdata
          ?.find((rettighet) => rettighet.type === periode.rettighetsType?.rettighetsType)
          ?.periodeKvoter.find(
            (kvote) => kvote.periode.fom === periode.periode.fom && kvote.periode.tom === periode.periode.tom
          )?.gjenværendeKvote ?? <InlineMessage status="error">Kunne ikke hente data</InlineMessage>)
      : undefined;

  return (
    <Table.Row>
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
      {isVisRettigheterForVedtakEnabled && <Table.DataCell>{gjenværendeKvote}</Table.DataCell>}
      <Table.DataCell>
        {formaterDatoForFrontend(periode.meldePeriode.fom)} - {formaterDatoForFrontend(periode.meldePeriode.tom)}
      </Table.DataCell>
    </Table.Row>
  );
};

export const Underveisgrunnlag = ({ grunnlag, readOnly, behandlingVersjon, rettighetsdata }: Props) => {
  // TODO AAP-1709 Fjern feature toggle etter verifisering i dev
  const isVisRettigheterForVedtakEnabled = useFeatureFlag('VisRettigheterForVedtak');
  const behandlingsReferanse = useBehandlingsReferanse();

  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_UTTAK');
  const { visningModus, visningActions } = useVilkårskortVisning(readOnly, 'FASTSETT_UTTAK', undefined);

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading="Underveis"
      steg={'FASTSETT_UTTAK'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.FORESLÅ_UTTAK_KODE,
          },
          referanse: behandlingsReferanse,
        });
      }}
      knappTekst={'Neste'}
      onDeleteMellomlagringClick={undefined}
      onLagreMellomLagringClick={undefined}
      mellomlagretVurdering={undefined}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Vurdert periode</Table.HeaderCell>
            <Table.HeaderCell>Utfall</Table.HeaderCell>
            <Table.HeaderCell>Avslagsårsak</Table.HeaderCell>
            <Table.HeaderCell>Gradering</Table.HeaderCell>
            <Table.HeaderCell>Trekk (dagsatser)</Table.HeaderCell>
            <Table.HeaderCell>Rettighetstype</Table.HeaderCell>
            {isVisRettigheterForVedtakEnabled && <Table.HeaderCell>Dager igjen</Table.HeaderCell>}
            <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.map((periode, index) => (
            <Perioderad
              key={index}
              periode={periode}
              rettighetsdata={rettighetsdata}
              isVisRettigheterForVedtakEnabled={isVisRettigheterForVedtakEnabled}
            />
          ))}
        </Table.Body>
      </Table>
      <div className={styles.foreslåvedtak}>
        {!readOnly && <BodyShort>Trykk på neste steg for å komme videre.</BodyShort>}
        <LøsBehovOgGåTilNesteStegStatusAlert
          status={status}
          løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        />
      </div>
    </VilkårskortMedFormOgMellomlagringNyVisning>
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
