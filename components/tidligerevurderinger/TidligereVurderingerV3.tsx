import React, { useState } from 'react';
import { Label, BodyShort, Detail, VStack, ExpansionCard, Table, Chips, HStack } from '@navikt/ds-react';
import styles from 'components/tidligerevurderinger/TidligereVurderingerV3.module.css';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { TidligereVurdering } from './TidligereVurderingV2';
import { ClockDashedIcon } from '@navikt/aksel-icons';

interface Props {
  tidligereVurderinger: TidligereVurdering[];
}

export const TidligereVurderingerV3 = ({ tidligereVurderinger }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = tidligereVurderinger[selectedIndex];

  return (
    <ExpansionCard
      aria-label="Tidligere vurderinger"
      size="small"
      defaultOpen={false}
      className={styles.tidligereVurderingerV3}
    >
      <ExpansionCard.Header>
        <div className={styles.cardHeadingV3}>
          <div>
            <ClockDashedIcon title="a11y-title" />
          </div>
          <ExpansionCard.Title size="small">Tidligere vurderinger</ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack className={styles.panelV3}>
          <Chips size={'medium'}>
            <VStack gap={'1'}>
              {tidligereVurderinger.map((v, index) => {
                const periode = `${formaterDatoForFrontend(v.periode.fom)} - ${v.periode.tom ? formaterDatoForFrontend(v.periode.tom) : ''}`;
                const flereVurderinger = tidligereVurderinger.length > 1
                return (
                  //@ts-ignore
                  <Chips.Toggle
                    type="button"
                    checkmark={false}
                    key={index}
                    selected={index === selectedIndex && flereVurderinger}
                    onClick={() => {
                      return flereVurderinger ? setSelectedIndex(index) : null;
                    }}
                    className={flereVurderinger ? styles.sidebarItemV3 : styles.sidebarItemSingleV3}
                  >
                    <span
                      style={{
                        textDecoration: v.erGjeldendeVurdering ? 'none' : 'line-through',
                        fontWeight: 'bold',
                      }}
                    >
                      {periode}
                    </span>
                  </Chips.Toggle>
                );
              })}
            </VStack>
          </Chips>

          <div className={styles.vurderingDetailV3}>
            <div className={styles.fieldsV3}>
              {selected.felter.map((felt, i) => (
                <VStack key={i}>
                  <Label size="small">{felt.label}</Label>
                  <BodyShort size="small">{felt.value}</BodyShort>
                </VStack>
              ))}
            </div>

            <Detail className={styles.footerV3} align={'end'}>
              {`Vurdert av ${selected.vurdertAvIdent}, ${formaterDatoForFrontend(selected.vurdertDato)}`}
            </Detail>
          </div>
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
