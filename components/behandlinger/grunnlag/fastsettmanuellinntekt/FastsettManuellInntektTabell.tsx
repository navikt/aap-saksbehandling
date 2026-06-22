import { ErrorMessage, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { formaterTilNok } from 'lib/utils/string';
import styles from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektTabell.module.css';
import { UseFormReturn } from 'react-hook-form';
import { FastsettManuellInntektForm, Tabellår } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/types';

interface Props {
  form: UseFormReturn<FastsettManuellInntektForm>;
  tabellår: Tabellår[];
  readOnly?: boolean;
  låstVisning?: boolean;
}

export const FastsettManuellInntektTabell = ({ tabellår, form, readOnly, låstVisning }: Props) => {
  const regnUtTotalbeløpPerÅr = (ferdigLignetPGI: number, beregnetPGI: number, eøsInntekt: number): string => {
    const total = beregnetPGI > 0 ? beregnetPGI + eøsInntekt : ferdigLignetPGI + eøsInntekt;
    return formaterTilNok(total);
  };

  // Totalt for split-årets informasjonsrad: summen av delperiodenes (beregnet PGI + EØS).
  const regnUtTotalForSplittÅr = (år: number): string => {
    const alleRader = låstVisning ? tabellår : form.watch('tabellår');
    const sum = alleRader
      .filter((rad) => rad.år === år && rad.erDelperiode)
      .reduce((acc, rad) => acc + Number(rad.beregnetPGI ?? 0) + Number(rad.eøsInntekt ?? 0), 0);
    return sum > 0 ? formaterTilNok(sum) : '-';
  };

  return (
    <VStack gap={'space-8'}>
      <Label size={'small'}>Hvilke år skal inntekt overstyres?</Label>
      <TableStyled tablelayout={'FIXED'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>År</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Ferdig lignet PGI</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Beregnet PGI</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>EØS-beregnet inntekt</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Totalt</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body data-testid={'inntektstabell'}>
          {tabellår.map((år, index) => {
            const ferdigLignetPGI = låstVisning ? år.ferdigLignetPGI : form.watch(`tabellår.${index}.ferdigLignetPGI`);
            const beregnetPGI = låstVisning ? år.beregnetPGI : form.watch(`tabellår.${index}.beregnetPGI`);
            const eøsInntekt = låstVisning ? år.eøsInntekt : form.watch(`tabellår.${index}.eøsInntekt`);
            const redigerbar = !år.erKunVisning;
            return (
              <Table.Row key={år.label ?? år.år}>
                <Table.DataCell textSize={'small'}>{år.label ?? år.år}</Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'ferdigLignetPGI'}>
                  {år.ferdigLignetPGI ? formaterTilNok(år.ferdigLignetPGI) : '-'}
                </Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'beregnetPGI'}>
                  {!redigerbar ? (
                    '-'
                  ) : låstVisning ? (
                    beregnetPGI ? (
                      formaterTilNok(Number(beregnetPGI))
                    ) : (
                      '-'
                    )
                  ) : (
                    <TextFieldWrapper
                      className={styles.inntektfelt}
                      name={`tabellår.${index}.beregnetPGI`}
                      control={form.control}
                      type={'number'}
                      hideLabel={true}
                      readOnly={år.ferdigLignetPGI !== undefined || readOnly}
                    />
                  )}
                </Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'eøsInntekt'}>
                  {!redigerbar ? (
                    '-'
                  ) : låstVisning ? (
                    eøsInntekt ? (
                      formaterTilNok(Number(eøsInntekt))
                    ) : (
                      '-'
                    )
                  ) : (
                    <TextFieldWrapper
                      className={styles.inntektfelt}
                      name={`tabellår.${index}.eøsInntekt`}
                      control={form.control}
                      type={'number'}
                      hideLabel={true}
                      readOnly={readOnly}
                    />
                  )}
                </Table.DataCell>
                <Table.DataCell data-testid={'totalt'} textSize={'small'}>
                  {år.erKunVisning
                    ? regnUtTotalForSplittÅr(år.år)
                    : år.erDelperiode
                      ? '-'
                      : regnUtTotalbeløpPerÅr(ferdigLignetPGI ?? 0, Number(beregnetPGI ?? 0), Number(eøsInntekt ?? 0))}
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
      {form.formState.errors.tabellår && (
        <ErrorMessage size={'small'} showIcon>
          {form.formState.errors.tabellår[0]?.message}
        </ErrorMessage>
      )}
    </VStack>
  );
};
