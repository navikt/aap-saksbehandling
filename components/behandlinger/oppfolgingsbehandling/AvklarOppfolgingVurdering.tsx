'use client';

import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { AvklarOppfolgingsoppgaveGrunnlagResponse, Vurderingsbehov } from 'lib/types/types';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormEvent } from 'react';
import { vurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { BodyShort, Label } from '@navikt/ds-react';

interface SykdomProps {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: AvklarOppfolgingsoppgaveGrunnlagResponse;
}

interface FormFields {
  årsak: string;
  konsekvens: 'INGEN' | 'OPPRETT_VURDERINGSBEHOV';
  hvaSkalRevurderes: Vurderingsbehov[];
}

export const AvklaroppfolgingVurdering = ({ behandlingVersjon, readOnly, grunnlag }: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_OPPFØLGING');

  const { form, formFields } = useConfigForm<FormFields>(
    {
      årsak: {
        type: 'textarea',
        label: 'Hva er årsaken?',
        rules: { required: 'Du må skrive en årsak.' },
        defaultValue: grunnlag.grunnlag?.årsak || undefined,
      },
      konsekvens: {
        type: 'radio',
        label: 'Hva blir konsekvens av oppfølgingsoppgaven?',
        rules: { required: 'Du må fylle inn en konsekvens.' },
        options: [
          { label: 'Ingen konsekvens for saken', value: 'INGEN' },
          { label: 'Opprett vurderingsbehov', value: 'OPPRETT_VURDERINGSBEHOV' },
        ],
        defaultValue: grunnlag.grunnlag?.konsekvensAvOppfølging,
      },
      hvaSkalRevurderes: {
        type: 'combobox_multiple',
        label: 'Hvilke opplysninger skal revurderes?',
        options: vurderingsbehovOptions,
        defaultValue: grunnlag.grunnlag?.opplysningerTilRevurdering,
      },
    },
    { readOnly: readOnly }
  );

  const behovsType =
    grunnlag.hvemSkalFølgeOpp == 'NasjonalEnhet'
      ? Behovstype.AVKLAR_OPPFØLGINGSBEHOV_NAY
      : Behovstype.AVKLAR_OPPFØLGINGSBEHOV_LOKALKONTOR;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: behovsType,
          avklarOppfølgingsbehovVurdering: {
            konsekvensAvOppfølging: data.konsekvens,
            opplysningerTilRevurdering: data.hvaSkalRevurderes,
            årsak: data.årsak,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Avklar oppfølgingsoppgave'}
      steg="AVKLAR_OPPFØLGING"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      vurdertAvAnsatt={undefined}
      knappTekst={'Fullfør'}
    >
      <div>
        <Label>Dato for oppfølging</Label>
        <BodyShort>{grunnlag.datoForOppfølging}</BodyShort>
      </div>
      <div>
        <Label>Hva skal følges opp?</Label>
        <BodyShort>{grunnlag.hvaSkalFølgesOpp}</BodyShort>
      </div>
      <FormField form={form} formField={formFields.konsekvens} />
      {form.watch('konsekvens') != 'INGEN' && (
        <>
          <FormField form={form} formField={formFields.hvaSkalRevurderes} />
          <FormField form={form} formField={formFields.årsak} />
        </>
      )}
    </VilkårsKortMedForm>
  );
};
