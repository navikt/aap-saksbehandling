'use client';

import { FieldArray, UseFormReturn } from 'react-hook-form';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Checkbox, ErrorMessage, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import {
  YrkesskadeMedSkadeDatoFormFields,
  YrkesskadeMedSkadeDatoSak,
} from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { JaEllerNei } from 'lib/utils/form';
import { storForbokstav } from 'lib/utils/string';

interface Props {
  form: UseFormReturn<YrkesskadeMedSkadeDatoFormFields>;
  readOnly: boolean;
  yrkesskader: YrkesskadeMedSkadeDatoSak[];
  update: (index: number, value: FieldArray<YrkesskadeMedSkadeDatoFormFields, 'relevanteYrkesskadeSaker'>) => void;
  erÅrsakssammenheng: string;
}

export const YrkesskadeVurderingTabell = ({ form, yrkesskader, readOnly, update, erÅrsakssammenheng }: Props) => {
  function oppdaterTilknytning(index: number, erTilknyttet: boolean, yrkesskade: YrkesskadeMedSkadeDatoSak) {
    update(index, {
      ref: yrkesskade.ref,
      kilde: yrkesskade.kilde,
      skadedato: yrkesskade.skadedato,
      manuellYrkesskadeDato: yrkesskade.manuellYrkesskadeDato,
      saksnummer: yrkesskade.saksnummer,
      erTilknyttet,
      vedtaksdato: yrkesskade.vedtaksdato,
      skadeart: yrkesskade.skadeart,
      diagnose: yrkesskade.diagnose,
      skadekombinasjoner: yrkesskade.skadekombinasjoner,
      skadekombinasjonerTekst: yrkesskade.skadekombinasjonerTekst,
    });
  }

  const ingenYrkesskadeErTilknyttet = form
    .getValues('relevanteYrkesskadeSaker')
    ?.every((yrkesskade) => !yrkesskade.erTilknyttet);

  return (
    <VStack gap={'space-8'}>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Tilknytt yrkesskade</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Saksnummer</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Kilde</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Skadedato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Vedtaksdato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Skadeart</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Diagnose</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Skadebeskrivelse</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {yrkesskader.length > 0 && (
          <Table.Body>
            {yrkesskader.map((yrkesskade, index) => (
              <Table.Row key={`${yrkesskade.ref}-${yrkesskade.saksnummer ?? index}`}>
                <Table.DataCell textSize={'small'}>
                  <Checkbox
                    size={'small'}
                    hideLabel
                    value={yrkesskade.ref}
                    checked={yrkesskade.erTilknyttet}
                    onChange={(e) => oppdaterTilknytning(index, e.target.checked, yrkesskade)}
                    readOnly={readOnly || erÅrsakssammenheng === JaEllerNei.Nei}
                  >
                    Tilknytt yrkesskade til vurdering
                  </Checkbox>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{yrkesskade.saksnummer}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {yrkesskade.kilde ? storForbokstav(yrkesskade.kilde) : '–'}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {yrkesskade.skadedato ? (
                    formaterDatoForFrontend(yrkesskade.skadedato)
                  ) : (
                    <DateInputWrapper
                      name={`relevanteYrkesskadeSaker.${index}.manuellYrkesskadeDato`}
                      control={form.control}
                      readOnly={!yrkesskade.erTilknyttet || readOnly}
                      rules={{
                        validate: (value) => {
                          if (!yrkesskade.erTilknyttet) {
                            return;
                          } else if (!value) {
                            return 'Du må angi dato for yrkesskade';
                          }
                          return validerDato(value as string);
                        },
                      }}
                      hideLabel={true}
                    />
                  )}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {yrkesskade.vedtaksdato ? formaterDatoForFrontend(yrkesskade.vedtaksdato) : '–'}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {yrkesskade.skadeart ? storForbokstav(yrkesskade.skadeart) : '–'}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {yrkesskade.diagnose ? storForbokstav(yrkesskade.diagnose) : '–'}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {yrkesskade.skadekombinasjoner
                    ? yrkesskade.skadekombinasjoner
                        ?.map((k) => `${storForbokstav(k.skadetype)} i ${k.kroppsdel.toLowerCase()}`)
                        .join(', ')
                    : yrkesskade.skadekombinasjonerTekst || '–'}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </TableStyled>
      {form.formState.errors.relevanteYrkesskadeSaker && ingenYrkesskadeErTilknyttet && (
        <ErrorMessage size={'small'} showIcon>
          {form.formState.errors.relevanteYrkesskadeSaker?.root?.message}
        </ErrorMessage>
      )}
    </VStack>
  );
};
