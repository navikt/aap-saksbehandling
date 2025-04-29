'use client';

import { SamordningUføreGrunnlag } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { SamordningUføreTabell } from 'components/behandlinger/underveis/samordninguføre/SamordningUføreTabell';
import { formaterDatoForBackend } from 'lib/utils/date';
import { format, parse } from 'date-fns';
import { BodyShort, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  grunnlag: SamordningUføreGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}
export interface SamordningUføreFormFields {
  begrunnelse: string;
  vurderteSamordninger: SamordnetUførePeriode[];
}
type SamordnetUførePeriode = {
  gradering?: number;
  virkningstidspunkt: string;
};
export const SamordningUføre = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SAMORDNING_UFØRE');
  grunnlag.grunnlag[0].endringStatus;

  function hentDefaultSamordningerFraVurderingerEllerGrunnlag(
    grunnlag: SamordningUføreGrunnlag
  ): SamordnetUførePeriode[] {
    if (grunnlag.vurdering?.vurderingPerioder?.length) {
      return grunnlag.vurdering.vurderingPerioder.map((vurdering) => ({
        gradering: vurdering.uføregradTilSamordning,
        virkningstidspunkt:
          vurdering.virkningstidspunkt && format(new Date(vurdering.virkningstidspunkt), 'dd.MM.yyyy'),
      }));
    }
    if (grunnlag.grunnlag.length) {
      return grunnlag.grunnlag
        .filter((ytelse) => ytelse.endringStatus === 'NY')
        .map((ytelse) => ({
          virkningstidspunkt: ytelse.virkningstidspunkt && format(new Date(ytelse.virkningstidspunkt), 'dd.MM.yyyy'),
        }));
    }
    return [];
  }
  const { form, formFields } = useConfigForm<SamordningUføreFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder hvilken grad med uføre som skal samordnes med AAP',
        rules: { required: 'Skriv begrunnelse' },
        defaultValue: grunnlag.vurdering?.begrunnelse,
      },
      vurderteSamordninger: {
        type: 'fieldArray',
        defaultValue: hentDefaultSamordningerFraVurderingerEllerGrunnlag(grunnlag),
      },
    },
    { readOnly }
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit(async (data) =>
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SAMORDNING_UFORE,
          samordningUføreVurdering: {
            begrunnelse: data.begrunnelse,
            vurderingPerioder: data.vurderteSamordninger.map((samordning) => ({
              virkningstidspunkt: formaterDatoForBackend(
                parse(samordning.virkningstidspunkt, 'dd.MM.yyyy', new Date())
              ),
              uføregradTilSamordning: samordning.gradering!,
            })),
          },
        },
        referanse: behandlingsreferanse,
      })
    )(event);
  }
  return (
    <VilkårsKortMedForm
      heading="Samordning med delvis uføre"
      steg="SAMORDNING_UFØRE"
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      visBekreftKnapp={!readOnly}
      erAktivtSteg={true}
    >
      <FormField form={form} formField={formFields.begrunnelse} />
      {grunnlag?.grunnlag?.length > 0 && (
        <VStack gap={'2'}>
          <Label size={'small'}>Vedtak om uføretrygd</Label>
          <BodyShort size={'small'}>Vi har funnet følgende perioder med overlapp mellom uføretrygd og Aap.</BodyShort>
          <TableStyled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Virkningstidspunkt</Table.HeaderCell>
                <Table.HeaderCell>Kilde</Table.HeaderCell>
                <Table.HeaderCell>Uføregrad</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {grunnlag.grunnlag.map((ytelse, index) => (
                <Table.Row key={`${index}-rad`}>
                  <Table.DataCell textSize="small">
                    {ytelse.virkningstidspunkt && format(new Date(ytelse.virkningstidspunkt), 'dd.MM.yyyy')}
                  </Table.DataCell>
                  <Table.DataCell textSize="small">{ytelse.kilde}</Table.DataCell>
                  <Table.DataCell textSize="small">{ytelse.uføregrad}</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </TableStyled>
        </VStack>
      )}
      <SamordningUføreTabell form={form} readOnly={readOnly} />
    </VilkårsKortMedForm>
  );
};
