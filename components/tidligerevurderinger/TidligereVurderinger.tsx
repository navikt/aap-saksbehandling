import { ClockDashedIcon } from '@navikt/aksel-icons';
import { ExpansionCard, Table } from '@navikt/ds-react';

import { Sykdomsvurdering } from 'lib/types/types';
import styles from './TidligereVurderinger.module.css';
import { format, parse, subDays } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';

function deepEqual(objekt1: any, objekt2: any, ignorerFelt: string[] = []): boolean {
  if (objekt1 === objekt2) return true;

  if (typeof objekt1 !== 'object' || typeof objekt2 !== 'object' || objekt1 === null || objekt2 === null) {
    return false;
  }

  const keys1 = Object.keys(objekt1).filter((key) => !ignorerFelt.includes(key));
  const keys2 = Object.keys(objekt2).filter((key) => !ignorerFelt.includes(key));

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(objekt1[key], objekt2[key], ignorerFelt)) {
      return false;
    }
  }

  return true;
}

const mapTilJaEllerNei = (verdi?: boolean) => (verdi ? 'Ja' : 'Nei');
interface VurderingProps {
  vurdering: Sykdomsvurdering;
  søknadstidspunkt: string;
  vurderingErGjeldende: boolean;
  sluttdato?: string;
}

export const Vurdering = ({ vurdering, søknadstidspunkt, vurderingErGjeldende, sluttdato }: VurderingProps) => {
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
        <span style={{ marginLeft: '0.25rem', textDecoration: vurderingErGjeldende ? 'none' : 'line-through' }}>
          {vurdering.vurderingenGjelderFra
            ? formaterDatoForFrontend(vurdering.vurderingenGjelderFra)
            : formaterDatoForFrontend(søknadstidspunkt)}
          {' - '}
          {sluttdato}
        </span>
      </Table.DataCell>
      <Table.DataCell align="right">
        ({vurdering.vurdertAv.ansattnavn ?? vurdering.vurdertAv.ident}) {formaterDatoForFrontend(vurdering.vurdertAv.dato)}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

interface Props {
  historiskeVurderinger: Sykdomsvurdering[];
  gjeldendeVurderinger: Sykdomsvurdering[];
  søknadstidspunkt: string;
}

export const TidligereVurderinger = ({ historiskeVurderinger, gjeldendeVurderinger, søknadstidspunkt }: Props) => {
  const antallVurderinger = historiskeVurderinger.length;
  const finnSluttdato = (index: number) => {
    if (antallVurderinger <= 1 || index === 0) {
      return undefined;
    }
    const forrigeGjelderFra = historiskeVurderinger.at(index - 1)?.vurderingenGjelderFra;
    if (!forrigeGjelderFra) {
      return undefined;
    }
    return format(subDays(parse(forrigeGjelderFra, 'yyyy-MM-dd', new Date()), 1), 'dd.MM.yyyy');
  };

  const erVurderingenGjeldende = (historiskVurdering: Sykdomsvurdering) => {
    const vurderingenFinnesSomGjeldende = gjeldendeVurderinger.some((gjeldendeVurdering) =>
      deepEqual(historiskVurdering, gjeldendeVurdering, ['dokumenterBruktIVurderingen', 'bidiagnoser'])
    );
    return vurderingenFinnesSomGjeldende;
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
            {historiskeVurderinger.map((vurdering, index) => {
              const vurderingErGjeldende = erVurderingenGjeldende(vurdering);
              return (
                <Vurdering
                  key={index}
                  vurdering={vurdering}
                  søknadstidspunkt={søknadstidspunkt}
                  sluttdato={vurderingErGjeldende ? finnSluttdato(index) : undefined}
                  vurderingErGjeldende={vurderingErGjeldende}
                />
              );
            })}
          </Table.Body>
        </Table>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
