import { CheckmarkCircleIcon, ClockDashedIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { ExpansionCard, Table } from '@navikt/ds-react';

import styles from './TidligereVurderinger.module.css';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';

type Vilkårsstatus = 'oppfylt' | 'ikke_oppfylt';

export type HistoriskVurdering = {
  id: string;
  status: 'oppfylt' | 'ikke_oppfylt';
  vurdertAv: string;
  vedtaksdato: string;
};

const vurderinger: HistoriskVurdering[] = [
  {
    status: 'oppfylt',
    vurdertAv: 'vldr',
    vedtaksdato: '2024-12-01',
    id: '234',
  },
  {
    status: 'ikke_oppfylt',
    vurdertAv: 'vldrx38',
    vedtaksdato: '2024-07-14',
    id: '490',
  },
];

const Statusikon = ({ status }: { status: Vilkårsstatus }) => {
  if (status === 'ikke_oppfylt') {
    return (
      <div>
        <CheckmarkCircleIcon className={`${styles.statusIkon} ${styles.ikkeOppfylt}`} />
      </div>
    );
  }
  return (
    <div>
      <XMarkOctagonIcon className={`${styles.statusIkon} ${styles.oppfylt}`} />
    </div>
  );
};

const statustekst = (status: Vilkårsstatus) => (status === 'ikke_oppfylt' ? 'Vilkår ikke oppfylt' : 'Vilkår oppfylt');

/*
 * Det gjenstår å håndtere visningen av den faktiske vurderingen som er gjort for vilkåret
 */

export const Vurdering = ({ vurdering }: { vurdering: HistoriskVurdering }) => {
  const content = <span>Her kommer det en del tekst ramset opp</span>;
  return (
    <Table.ExpandableRow content={content} togglePlacement="right" expandOnRowClick>
      <Table.DataCell style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        <Statusikon status={vurdering.status} />
        {statustekst(vurdering.status)}
      </Table.DataCell>
      <Table.DataCell align="right">
        ({vurdering.vurdertAv}) {formaterDatoForVisning(vurdering.vedtaksdato)}
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

export const TidligereVurderinger = () => {
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
          <ExpansionCard.Title>Tidligere vurderinger</ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <Table>
          <Table.Body>
            {vurderinger.map((vurdering) => (
              <Vurdering vurdering={vurdering} key={vurdering.id} />
            ))}
          </Table.Body>
        </Table>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
