import { ClockDashedIcon } from '@navikt/aksel-icons';
import { ExpansionCard, Table } from '@navikt/ds-react';

import styles from './TidligereVurderinger.module.css';
import { format, parse, subDays } from 'date-fns';
import { OvergangUføreVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';

const mapTilJaEllerNei = (verdi?: boolean) => (verdi ? 'Ja' : 'Nei');

interface VurderingProps {
  vurdering: OvergangUføreVurdering;
  søknadstidspunkt: string;
  vurderingErGjeldende: boolean;
  sluttdato?: string;
}

export const Vurdering = ({ vurdering, søknadstidspunkt, vurderingErGjeldende, sluttdato }: VurderingProps) => {
  const content = (
    <div>
      <span>{vurdering?.begrunnelse}</span>
      <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'row', flexWrap: 'wrap' }}>
        <span>Har brukeren søkt uføretrygd?: {mapTilJaEllerNei(vurdering.brukerSoktUforetrygd)}</span>
        <span>Har brukeren fått vedtak om uføretrygd?: {vurdering.brukerSoktUforetrygd}</span>
        <span>
          c: Har brukeren rett på AAP?
          {mapTilJaEllerNei(vurdering.brukerRettPaaAAP ?? undefined)}
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
        ({vurdering.vurdertAv.ident}) {vurdering.vurdertAv.dato && formaterDatoForFrontend(vurdering.vurdertAv.dato)}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

interface Props {
  historiskeVurderinger: OvergangUføreVurdering[];
  gjeldendeVurderinger: OvergangUføreVurdering[];
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

  const erVurderingenGjeldende = (historiskVurdering: OvergangUføreVurdering) => {
    const vurderingenFinnesSomGjeldende = gjeldendeVurderinger.some((gjeldendeVurdering) =>
      deepEqual(historiskVurdering, gjeldendeVurdering, ['dokumenterBruktIVurderingen'])
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
