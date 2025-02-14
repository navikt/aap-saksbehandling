import { CheckmarkCircleIcon, ClockDashedIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { ExpansionCard, Table } from '@navikt/ds-react';

import { Sykdomsvurdering } from 'lib/types/types';
import styles from './TidligereVurderinger.module.css';

type Vilkårsstatus = 'oppfylt' | 'ikke_oppfylt'; // TODO nei

const Statusikon = ({ status }: { status: Vilkårsstatus }) => {
  if (status === 'ikke_oppfylt') {
    return (
      <div>
        <XMarkOctagonIcon className={`${styles.statusIkon} ${styles.ikkeOppfylt}`} />
      </div>
    );
  }
  return (
    <div>
      <CheckmarkCircleIcon className={`${styles.statusIkon} ${styles.oppfylt}`} />
    </div>
  );
};

const statustekst = (status: Vilkårsstatus) => (status === 'ikke_oppfylt' ? 'Vilkår ikke oppfylt' : 'Vilkår oppfylt');

/*
 * Det gjenstår å håndtere visningen av den faktiske vurderingen som er gjort for vilkåret
 */

const mapTilJaEllerNei = (verdi?: boolean) => (verdi ? 'Ja' : 'Nei');

export const Vurdering = ({ vurdering }: { vurdering: Sykdomsvurdering }) => {
  const content = (
    <div>
      <span>{vurdering.begrunnelse}</span>
      <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'row', flexWrap: 'wrap' }}>
        <span>Har bruker sykdom, skade eller lyte: {mapTilJaEllerNei(vurdering.harSkadeSykdomEllerLyte)}</span>
        <span>Har bruker nedsatt arbeidsevne: {mapTilJaEllerNei(vurdering.erArbeidsevnenNedsatt ?? undefined)}</span>
        <span>
          Er arbeidsevnen nedsatt med minst halvparten:
          {mapTilJaEllerNei(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten ?? undefined)}
        </span>
        <span>
          Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt:
          {mapTilJaEllerNei(vurdering.erSkadeSykdomEllerLyteVesentligdel ?? undefined)}
        </span>
        <span>
          Er den nedsatte arbeidsevnen av en viss varighet:
          {mapTilJaEllerNei(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet ?? undefined)}
        </span>
      </div>
    </div>
  );
  return (
    <Table.ExpandableRow content={content} togglePlacement="right" expandOnRowClick>
      <Table.DataCell style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        <Statusikon status={'oppfylt'} />
        {statustekst('oppfylt')}
      </Table.DataCell>
      {/* TODO hent ident og vedtaksdato her når backend er klar */}
      <Table.DataCell align="right">(TODO) {vurdering.vurderingenGjelderFra}</Table.DataCell>
    </Table.ExpandableRow>
  );
};
interface Props {
  gjeldendeVedtatteVurderinger: Sykdomsvurdering[];
}

export const TidligereVurderinger = ({ gjeldendeVedtatteVurderinger }: Props) => {
  return (
    <ExpansionCard
      aria-label="Tidligere vurderinger"
      size="small"
      defaultOpen={false}
      className={styles.tidligereVurderinger}
    >
      <ExpansionCard.Header>
        <div className={styles.cardHeading}>
          <div>
            <ClockDashedIcon title="a11y-title" />
          </div>
          <ExpansionCard.Title size="small">Tidligere vurderinger</ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <Table>
          <Table.Body>
            {gjeldendeVedtatteVurderinger.map((vurdering, index) => (
              <Vurdering key={index} vurdering={vurdering} />
            ))}
          </Table.Body>
        </Table>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
