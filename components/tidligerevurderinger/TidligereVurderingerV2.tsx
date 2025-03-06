import { ExpansionCard, Table } from '@navikt/ds-react';
import styles from 'components/tidligerevurderinger/TidligereVurderinger.module.css';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { TidligereVurdering, TidligereVurderingV2 } from 'components/tidligerevurderinger/TidligereVurderingV2';
interface Props {
  tidligereVurderinger: TidligereVurdering[];
}

export const TidligereVurderingerV2 = ({ tidligereVurderinger }: Props) => {
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
              <TidligereVurderingV2 key={index} tidligereVurdering={vurdering} />
            ))}
          </Table.Body>
        </Table>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
