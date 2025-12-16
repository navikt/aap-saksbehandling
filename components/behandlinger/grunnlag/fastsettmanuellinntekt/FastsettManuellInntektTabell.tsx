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
    const total =
      beregnetPGI > 0 ? Number(beregnetPGI) + Number(eøsInntekt) : Number(ferdigLignetPGI) + Number(eøsInntekt);
    return formaterTilNok(total);
  };

  return (
    <VStack gap={'2'}>
      <Label size={'small'}>Hvilke år skal inntekt overstyres?</Label>
      <TableStyled className={styles.tabell}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>År</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Ferdig lignet PGI</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Beregnet PGI</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>EØS-inntekt</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Totalt</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body data-testid={'inntektstabell'}>
          {tabellår.map((år, index) => {
            const ferdigLignetPGI = låstVisning ? år.ferdigLignetPGI : form.watch(`tabellår.${index}.ferdigLignetPGI`);
            const beregnetPGI = låstVisning ? år.beregnetPGI : form.watch(`tabellår.${index}.beregnetPGI`);
            const eøsInntekt = låstVisning ? år.eøsInntekt : form.watch(`tabellår.${index}.eøsInntekt`);
            return (
              <Table.Row key={år.år}>
                <Table.DataCell textSize={'small'}>{år.år}</Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'ferdigLignetPGI'}>
                  {år.ferdigLignetPGI ? formaterTilNok(år.ferdigLignetPGI) : '-'}
                </Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'beregnetPGI'}>
                  {låstVisning ? (
                    beregnetPGI ? (
                      formaterTilNok(beregnetPGI)
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
                  {låstVisning ? (
                    eøsInntekt ? (
                      formaterTilNok(eøsInntekt)
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
                  {regnUtTotalbeløpPerÅr(ferdigLignetPGI ?? 0, beregnetPGI ?? 0, eøsInntekt ?? 0)}
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
