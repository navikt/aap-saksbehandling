import React, { useState } from 'react';
import { Label, BodyShort, Detail, VStack, ExpansionCard, Chips } from '@navikt/ds-react';
import styles from 'components/tidligerevurderinger/TidligereVurderingerV3.module.css';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { ÅpenPeriode } from '../../lib/types/types';
import { ValuePair } from '../form/FormField';
import { format, parse, subDays } from 'date-fns';
import { erDatoFoerDato } from 'lib/validation/dateValidation';

interface Props<T> {
  data: T[];
  buildFelter: (vurdering: T) => ValuePair[];
  getErGjeldende?: (vurdering: T) => boolean;
  getVurdertAvIdent?: (vurdering: T) => string;
  getVurdertDato?: (vurdering: T) => string;
  getFomDato?: (vurdering: T) => string;
}

export interface TidligereVurdering {
  periode: ÅpenPeriode;
  vurdertAvIdent: string;
  vurdertDato: string;
  felter: ValuePair[];
  erGjeldendeVurdering: boolean;
}

export function TidligereVurderingerV3<T>({
  data,
  buildFelter,
  getErGjeldende = () => false,
  getVurdertAvIdent = (v: any) => v.vurdertAv.ident,
  getVurdertDato = (v: any) => v.vurdertAv.dato,
  getFomDato = (v: any) => v.vurderingenGjelderFra ?? v.vurdertAv?.dato,
}: Props<T>) {
  const finnSluttdato = (index: number, arr: T[]) => {
    if (arr.length <= 1 || index === 0) return null;

    const forrigeGjelderFra = getFomDato(arr[index - 1]);
    if (!forrigeGjelderFra) return null;

    const vurderingGjelderFra = getFomDato(arr[index]);
    if (forrigeGjelderFra === vurderingGjelderFra) {
      return format(subDays(parse(vurderingGjelderFra, 'yyyy-MM-dd', new Date()), 0), 'yyyy-MM-dd');
    }

    const tom = erDatoFoerDato(formaterDatoForFrontend(vurderingGjelderFra), formaterDatoForFrontend(forrigeGjelderFra))
      ? forrigeGjelderFra
      : vurderingGjelderFra;

    return format(subDays(parse(tom, 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM-dd');
  };

  const sortedData = [...data].sort((a, b) => {
    const afom = getFomDato(a);
    const bfom = getFomDato(b);

    if (afom === bfom) {
      const aGjeldende = getErGjeldende(a);
      const bGjeldende = getErGjeldende(b);

      if (aGjeldende && !bGjeldende) return -1;
      if (!aGjeldende && bGjeldende) return 1;
    }

    return sorterEtterNyesteDato(afom, bfom);
  });

  const mappedVurderinger: TidligereVurdering[] = sortedData.map((v, index, arr) => ({
    periode: {
      fom: getFomDato(v),
      tom: finnSluttdato(index, arr),
    },
    vurdertAvIdent: getVurdertAvIdent(v),
    vurdertDato: getVurdertDato(v),
    erGjeldendeVurdering: getErGjeldende(v),
    felter: buildFelter(v),
  }));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = mappedVurderinger[selectedIndex];

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
              {mappedVurderinger.map((v, index) => {
                const periode = `${formaterDatoForFrontend(v.periode.fom)} - ${v.periode.tom ? formaterDatoForFrontend(v.periode.tom) : ''}`;
                const flereVurderinger = mappedVurderinger.length > 1;
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
}
