'use client';

import { BodyShort, Table } from '@navikt/ds-react';
import { RettighetDto, UnderveisAvslagsÅrsak, UnderveisGrunnlag } from 'lib/types/types';
import { antallHverdagerIPeriode, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { mapUtfallTilTekst } from 'lib/utils/oversettelser';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import styles from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak.module.css';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useBehandlingsReferanse, useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { clientHentRettighetsdata } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { useFeatureFlag } from 'context/UnleashContext';
import useSWR from 'swr';

type Props = {
  grunnlag: UnderveisGrunnlag[];
  readOnly: boolean;
  behandlingVersjon: number;
};

const Perioderad = ({
  periode,
  gjenværendeKvote,
  isVisRettigheterForVedtakEnabled,
}: {
  periode: UnderveisGrunnlag;
  gjenværendeKvote: string;
  isVisRettigheterForVedtakEnabled: boolean;
}) => (
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

export const Underveisgrunnlag = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  // TODO AAP-1709 Fjern feature toggle etter verifisering i dev
  const isVisRettigheterForVedtakEnabled = useFeatureFlag('VisRettigheterForVedtak');
  const saksnummer = useSaksnummer();
  const behandlingsReferanse = useBehandlingsReferanse();

  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_UTTAK');

  const hentRettigheterRespons = useSWR(`/api/sak/${saksnummer}/rettighet`, () =>
    clientHentRettighetsdata(saksnummer)
  ).data;
  const rettigheter = isSuccess(hentRettigheterRespons) ? hentRettigheterRespons.data : [];
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
              gjenværendeKvote={utledGjenværendeKvote(rettigheter, grunnlag, periode)}
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

function utledGjenværendeKvote(
  rettigheter: RettighetDto[],
  perioder: UnderveisGrunnlag[],
  gjeldendePeriode: UnderveisGrunnlag
): string {
  const rettighetForPeriode = rettigheter.find(
    (rettighet) => rettighet.type === gjeldendePeriode.rettighetsType?.rettighetsType
  );
  const totalKvoteForRettighet = rettighetForPeriode?.kvote;
  const perioderTilOgMedGjeldende = perioder.filter((periode) => {
    const periodeSluttDato = stringToDate(periode.periode.tom);
    const gjeldendePeriodeSluttDato = stringToDate(gjeldendePeriode.periode.tom);
    return (
      periode.rettighetsType === gjeldendePeriode.rettighetsType?.rettighetsType &&
      !!periodeSluttDato &&
      !!gjeldendePeriodeSluttDato &&
      periodeSluttDato <= gjeldendePeriodeSluttDato
    );
  });
  const brukteKvoter = perioderTilOgMedGjeldende.map((periode) => {
    return antallHverdagerIPeriode(periode.periode.fom, periode.periode.tom);
  });

  const totaltBruktKvote = brukteKvoter.reduce((kvote1, kvote2) => kvote1 + kvote2);
  return totalKvoteForRettighet ? (totalKvoteForRettighet - totaltBruktKvote).toString() : '';
}

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
