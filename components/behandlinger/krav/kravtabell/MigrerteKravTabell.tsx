import { Button, Heading, Table } from '@navikt/ds-react';
import { KravGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import {
  formaterKravtype,
  getMigrerteKrav,
  hentOriginaleMigrertKravFormFelter,
} from 'components/behandlinger/krav/kravutils';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useFormContext, useWatch } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKrav';

interface Props {
  grunnlag: KravGrunnlag;
  readOnly: boolean;
}

export const MigrerteKravTabell = ({ grunnlag, readOnly }: Props) => {
  const form = useFormContext<KravFormFields>();
  const { control, getValues, setValue } = form;
  const valgteMigrerteKrav = useWatch({ control, name: 'valgteMigrerteKrav' }) ?? [];

  const toggleValgtMigrertKrav = (referanse: string) => {
    const gjeldende = getValues('valgteMigrerteKrav') ?? [];
    const erÅpen = gjeldende.includes(referanse);

    if (erÅpen) {
      const originaleFelter = hentOriginaleMigrertKravFormFelter(grunnlag, referanse);
      if (originaleFelter) {
        setValue(`migrerteKravVurderinger.${referanse}`, originaleFelter);
      }
    }

    const nyeValgteMigrerteKrav = erÅpen ? gjeldende.filter((r) => r !== referanse) : [...gjeldende, referanse];
    setValue('valgteMigrerteKrav', nyeValgteMigrerteKrav);
  };

  const nyeVurderinger = getMigrerteKrav(grunnlag.nyeVurderinger);
  const vedtatteVurderinger = getMigrerteKrav(grunnlag.vedtatteVurderinger);
  const alleVurderinger = [...nyeVurderinger, ...vedtatteVurderinger];

  return (
    <>
      <Heading size="xsmall">Migrert sak</Heading>
      <TableStyled size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Arenasaksnr</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Virkningstidspunkt på sak</Table.HeaderCell>
            <Table.HeaderCell>Migrert til Kelvin</Table.HeaderCell>
            <Table.HeaderCell>Resterende kvote på migreringstidspunkt</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            <Table.HeaderCell>Valg</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {alleVurderinger.map((vurdering) => {
            return (
              <Table.ExpandableRow content={vurdering.begrunnelse} key={vurdering.referanse}>
                <Table.DataCell textSize={'small'}>{vurdering.arenaSaksnummer}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {formaterDatoForFrontend(vurdering.virkningstidspunktArena)}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(vurdering.muligRettFra)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>Ordinær: {vurdering.resterendeKvoteOrdinær}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Button
                    type="button"
                    size="small"
                    variant={valgteMigrerteKrav.includes(vurdering.referanse) ? 'primary' : 'secondary'}
                    onClick={() => toggleValgtMigrertKrav(vurdering.referanse)}
                    disabled={readOnly}
                  >
                    {valgteMigrerteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
                  </Button>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </TableStyled>
    </>
  );
};
