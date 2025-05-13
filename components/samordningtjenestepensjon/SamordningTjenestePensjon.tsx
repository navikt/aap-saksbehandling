'use client';

import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { SamordningTjenestePensjonGrunnlag } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useConfigForm } from 'components/form/FormHook';
import { Behovstype, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormField } from 'components/form/FormField';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  grunnlag: SamordningTjenestePensjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  vurdering: string;
  skalEtterbetalingHoldesIgjen: JaEllerNei;
}

export const SamordningTjenestePensjon = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } = useLøsBehovOgGåTilNesteSteg(
    'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV'
  );

  const { form, formFields } = useConfigForm<FormFields>(
    {
      vurdering: {
        type: 'textarea',
        label: 'Vurdering',
        description: 'Vurder om etterbetaling for perioden skal holdes igjen i påvente av refusjonskrav.',
      },
      skalEtterbetalingHoldesIgjen: {
        type: 'radio',
        options: JaEllerNeiOptions,
        label: 'Skal etterbetaling holdes igjen for perioden?',
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(() =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.SAMORDNING_REFUSJONS_KRAV,
          //@ts-ignore under utvikling
          refusjonkravVurdering: {},
        },
        referanse: behandlingsReferanse,
      })
    )(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Refusjonskrav tjenestepensjon'}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      erAktivtSteg={true}
      steg={'VURDER_BISTANDSBEHOV'}
      visBekreftKnapp={!readOnly}
      onSubmit={handleSubmit}
    >
      <VStack gap={'1'}>
        <BodyShort weight={'semibold'}>
          Vi har funnet perioder der brukeren kan ha mottatt tjenestepensjonsordning
        </BodyShort>
        <BodyShort>Disse kan føre til refusjonskrav på etterbetaling.</BodyShort>
      </VStack>

      {grunnlag.tjenestepensjonForhold.map((tp, index) => {
        return (
          <TableStyled key={index}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                <Table.HeaderCell scope="col">Ordning</Table.HeaderCell>
                <Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tp.ytelser.map((ytelse, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.DataCell
                      textSize={'small'}
                    >{`${formaterDatoForFrontend(ytelse.ytelseIverksattFom)} - ${ytelse.ytelseIverksattTom && formaterDatoForFrontend(ytelse.ytelseIverksattTom)}`}</Table.DataCell>
                    <Table.DataCell textSize={'small'}>{tp.ordning.navn}</Table.DataCell>
                    <Table.DataCell textSize={'small'}>{ytelse.ytelseType}</Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </TableStyled>
        );
      })}

      <FormField form={form} formField={formFields.vurdering} />
      <FormField form={form} formField={formFields.skalEtterbetalingHoldesIgjen} />
    </VilkårsKortMedForm>
  );
};
