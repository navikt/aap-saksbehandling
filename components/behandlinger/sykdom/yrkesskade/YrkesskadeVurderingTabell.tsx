'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Checkbox, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { YrkesskadeFormFields, YrkesskadeSak } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

interface Props {
  form: UseFormReturn<YrkesskadeFormFields>;
  grunnlag: YrkesskadeVurderingGrunnlag;
  readOnly: boolean;
}

export const YrkesskadeVurderingTabell = ({ form }: Props) => {
  let { fields: relevanteYrkesskadeSaker, update } = useFieldArray({
    name: 'relevanteYrkesskadeSaker',
    control: form.control,
  });

  function oppdaterTilknytning(index: number, erTilknyttet: boolean, yrkesskade: YrkesskadeSak) {
    update(index, {
      ref: yrkesskade.ref,
      kilde: yrkesskade.kilde,
      skadedato: yrkesskade.skadedato,
      manuellYrkesskadeDato: yrkesskade.manuellYrkesskadeDato,
      saksnummer: yrkesskade.saksnummer,
      erTilknyttet,
    });
  }

  return (
    <TableStyled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textSize={'small'}>Tilknytt yrkesskade</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Saksnummer</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Kilde</Table.HeaderCell>
          <Table.HeaderCell textSize={'small'}>Skadedato</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {relevanteYrkesskadeSaker.length > 0 && (
        <Table.Body>
          {relevanteYrkesskadeSaker.map((yrkesskade, index) => (
            <Table.Row key={yrkesskade.ref}>
              <Table.DataCell textSize={'small'}>
                <Checkbox
                  size={'small'}
                  hideLabel
                  value={yrkesskade.ref}
                  checked={yrkesskade.erTilknyttet}
                  onChange={(e) => oppdaterTilknytning(index, e.target.checked, yrkesskade)}
                >
                  Tilknytt yrkesskade til vurdering
                </Checkbox>
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{yrkesskade.saksnummer}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{yrkesskade.kilde}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {yrkesskade.skadedato ? (
                  formaterDatoForFrontend(yrkesskade.skadedato)
                ) : (
                  <DateInputWrapper
                    name={`relevanteYrkesskadeSaker.${index}.manuellYrkesskadeDato`}
                    control={form.control}
                  />
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      )}
    </TableStyled>
  );
};
