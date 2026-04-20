'use client';

import { BodyShort, HStack, Table, Timeline } from '@navikt/ds-react';
import { tilhørighetVurdering, VisuellTidslinjeArbeidInntekt } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import styles from './TilhørighetsVurderingTabell.module.css';
import { OpplysningerContent } from 'components/behandlinger/lovvalg/opplysningercontent/OpplysningerContent';
import { formaterPeriode } from 'lib/utils/date';

interface Props {
  vurdering: tilhørighetVurdering[];
  oppfyllerOpplysningeneKravene: boolean;
  oppfyllerOpplysningeneKraveneTekst: string;
}

export const TilhørighetsVurderingTabell = ({
  vurdering,
  oppfyllerOpplysningeneKravene,
  oppfyllerOpplysningeneKraveneTekst,
}: Props) => {
  return (
    <TableStyled size={'small'}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          <Table.HeaderCell scope="col">Vurdert Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Opplysning</Table.HeaderCell>
          <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {vurdering.map((opplysning, index) => {
          const harVisuellTidslinje = opplysning.visuellTidslinje.length > 0;
          const erUtvidbar = harVisuellTidslinje || harMinstEttGrunnlag(opplysning);

          const radInnhold = (
            <>
              <Table.DataCell textSize="small" width={200}>
                {opplysning.kilde.map(mapKildeTilTekst).join(', ')}
              </Table.DataCell>
              <Table.DataCell textSize="small" width={300}>
                {opplysning.vurdertPeriode}
              </Table.DataCell>
              <Table.DataCell textSize="small" width={750}>
                {opplysning.opplysning}
              </Table.DataCell>
              <Table.DataCell textSize="small" width={'auto'}>
                <BodyShort size="small">{opplysning.resultat ? 'Ja' : 'Nei'}</BodyShort>
              </Table.DataCell>
            </>
          );
          const expandableContent = harVisuellTidslinje ? (
            <VisuellTidslinjeInnhold visuellTidslinje={opplysning.visuellTidslinje}></VisuellTidslinjeInnhold>
          ) : (
            <OpplysningerContent opplysning={opplysning} />
          );
          return erUtvidbar ? (
            <Table.ExpandableRow key={index} content={expandableContent}>
              {radInnhold}
            </Table.ExpandableRow>
          ) : (
            <Table.Row key={index} className={styles.rad}>
              <Table.DataCell style={{ minWidth: '48px' }}></Table.DataCell>
              {radInnhold}
            </Table.Row>
          );
        })}

        <Table.Row className={`${styles.rad} ${oppfyllerOpplysningeneKravene ? styles.godkjent : styles.avslått}`}>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell colSpan={3}>
            <BodyShort size={'small'} weight={'semibold'}>
              {oppfyllerOpplysningeneKraveneTekst}
            </BodyShort>
          </Table.DataCell>
          <Table.DataCell>
            <HStack gap={'1'} align={'center'}>
              {oppfyllerOpplysningeneKravene ? (
                <>
                  <CheckmarkCircleFillIcon className={styles.godkjentIcon} title={'Suksess'} />
                  <BodyShort size={'small'} weight={'semibold'}>
                    Ja
                  </BodyShort>
                </>
              ) : (
                <>
                  <ExclamationmarkTriangleFillIcon className={styles.avslåttIcon} title={'Advarsel'} />
                  <BodyShort size={'small'} weight={'semibold'}>
                    Nei
                  </BodyShort>
                </>
              )}
            </HStack>
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </TableStyled>
  );
};

type Kilde = 'SØKNAD' | 'PDL' | 'MEDL' | 'AA_REGISTERET' | 'A_INNTEKT' | 'EREG';

function mapKildeTilTekst(kilde: Kilde): string {
  switch (kilde) {
    case 'SØKNAD':
      return 'Søknad';
    case 'PDL':
      return 'PDL';
    case 'MEDL':
      return 'MEDL';
    case 'AA_REGISTERET':
      return 'AA Registeret';
    case 'A_INNTEKT':
      return 'A Inntekt';
    default:
      return kilde;
  }
}

function harMinstEttGrunnlag(vurdering: tilhørighetVurdering) {
  return [
    vurdering.arbeidInntektINorgeGrunnlag,
    vurdering.mottarSykepengerGrunnlag,
    vurdering.oppgittJobbetIUtlandGrunnlag,
    vurdering.oppgittUtenlandsOppholdGrunnlag,
    vurdering.manglerStatsborgerskapGrunnlag,
    vurdering.utenlandsAddresserGrunnlag?.adresser,
    vurdering.utenlandsAddresserGrunnlag?.personStatus,
    vurdering.vedtakImedlGrunnlag,
  ].some((grunnlag) => grunnlag !== null && grunnlag && grunnlag?.length > 0);
}

function VisuellTidslinjeInnhold({ visuellTidslinje }: { visuellTidslinje: VisuellTidslinjeArbeidInntekt[] }) {
  const datoer = visuellTidslinje.flatMap((it) => [new Date(it.periode.fom), new Date(it.periode.tom)]);

  const startDate = new Date(Math.min(...datoer.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...datoer.map((d) => d.getTime())));

  return (
    <Timeline startDate={startDate} endDate={endDate}>
      <Timeline.Row label={''}>
        {visuellTidslinje.map((item, i) => {
          return (
            <Timeline.Period
              key={i}
              start={new Date(item.periode.fom)}
              end={new Date(item.periode.tom)}
              status={item.periodeMangler ? 'danger' : 'success'}
              statusLabel={'Inntektstidslinje'}
            >
              {item.periodeMangler ? (
                <div>
                  <div>
                    <b>{formaterPeriode(item.periode.fom, item.periode.tom)}</b>
                  </div>
                  <div>Inntekt mangler</div>
                </div>
              ) : (
                <div>
                  <div>
                    <b>{formaterPeriode(item.periode.fom, item.periode.tom)}</b>
                  </div>
                  <div>
                    {item.virksomhetNavn} (org.nr: {item.virksomhetId})
                  </div>
                  <div>Inntekt: {item.beloep}</div>
                </div>
              )}
            </Timeline.Period>
          );
        })}
      </Timeline.Row>
      );
    </Timeline>
  );
}
