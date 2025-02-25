import { ClockDashedIcon } from '@navikt/aksel-icons';
import { ExpansionCard, Table } from '@navikt/ds-react';

import { Sykdomsvurdering } from 'lib/types/types';
import styles from './TidligereVurderinger.module.css';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { format, parse, subDays } from 'date-fns';

const mapTilJaEllerNei = (verdi?: boolean) => (verdi ? 'Ja' : 'Nei');
interface VurderingProps {
  vurdering: Sykdomsvurdering;
  søknadstidspunkt: string;
  sluttdato?: string;
}

export const Vurdering = ({ vurdering, søknadstidspunkt, sluttdato }: VurderingProps) => {
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
        <span style={{ marginLeft: '0.25rem' }}>
          {vurdering.vurderingenGjelderFra
            ? formaterDatoForVisning(vurdering.vurderingenGjelderFra)
            : formaterDatoForVisning(søknadstidspunkt)}
          {' - '}
          {sluttdato}
        </span>
      </Table.DataCell>
      <Table.DataCell align="right">
        ({vurdering.vurdertAvIdent}) {formaterDatoForVisning(vurdering.vurdertDato)}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

interface Props {
  tidligereVurderinger: Sykdomsvurdering[];
  søknadstidspunkt: string;
}

export const TidligereVurderinger = ({ tidligereVurderinger, søknadstidspunkt }: Props) => {
  const antallVurderinger = tidligereVurderinger.length;
  const finnSluttdato = (index: number) => {
    if (antallVurderinger <= 1 || index === 0) {
      return undefined;
    }
    const forrigeGjelderFra = tidligereVurderinger.at(index - 1)?.vurderingenGjelderFra;
    if (!forrigeGjelderFra) {
      return undefined;
    }
    return format(subDays(parse(forrigeGjelderFra, 'yyyy-MM-dd', new Date()), 1), 'dd.MM.yyyy');
  };

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
            {tidligereVurderinger.map((vurdering, index) => (
              <Vurdering
                key={index}
                vurdering={vurdering}
                søknadstidspunkt={søknadstidspunkt}
                sluttdato={finnSluttdato(index)}
              />
            ))}
          </Table.Body>
        </Table>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
