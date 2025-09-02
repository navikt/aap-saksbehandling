'use client';

import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { AvklarOppfolgingsoppgaveGrunnlagResponse, MellomlagretVurdering, Vurderingsbehov } from 'lib/types/types';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { VilkRskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { FormEvent } from 'react';
import { vurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { BodyShort, Label } from '@navikt/ds-react';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: AvklarOppfolgingsoppgaveGrunnlagResponse;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  årsak: string;
  konsekvens: Konsekvens;
  hvaSkalRevurderes: Vurderingsbehov[];
}

type Konsekvens = 'INGEN' | 'OPPRETT_VURDERINGSBEHOV';

type DraftFormFields = Partial<FormFields>;

export const AvklaroppfolgingVurdering = ({
  behandlingVersjon,
  readOnly,
  grunnlag,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_OPPFØLGING');

  const behovsType =
    grunnlag.hvemSkalFølgeOpp == 'NasjonalEnhet'
      ? Behovstype.AVKLAR_OPPFØLGINGSBEHOV_NAY
      : Behovstype.AVKLAR_OPPFØLGINGSBEHOV_LOKALKONTOR;

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(behovsType, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.grunnlag);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      årsak: {
        type: 'textarea',
        label: 'Hva er årsaken?',
        rules: { required: 'Du må skrive en årsak.' },
        defaultValue: defaultValue.årsak,
      },
      konsekvens: {
        type: 'radio',
        label: 'Hva blir konsekvens av oppfølgingsoppgaven?',
        rules: { required: 'Du må fylle inn en konsekvens.' },
        options: [
          { label: 'Ingen konsekvens for saken', value: 'INGEN' },
          { label: 'Opprett vurderingsbehov', value: 'OPPRETT_VURDERINGSBEHOV' },
        ],
        defaultValue: defaultValue.konsekvens,
      },
      hvaSkalRevurderes: {
        type: 'combobox_multiple',
        label: 'Hvilke opplysninger skal revurderes?',
        options: vurderingsbehovOptions,
        defaultValue: defaultValue.hvaSkalRevurderes,
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
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
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  return (
    <VilkRskortMedFormOgMellomlagring
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
      readOnly={readOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag.grunnlag ? mapVurderingToDraftFormFields(grunnlag.grunnlag) : emptyDraftFormFields())
        )
      }
    >
      <div>
        <Label>Dato for oppfølging</Label>
        <BodyShort>{formaterDatoForFrontend(grunnlag.datoForOppfølging)}</BodyShort>
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
    </VilkRskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(
  vurdering: AvklarOppfolgingsoppgaveGrunnlagResponse['grunnlag']
): DraftFormFields {
  return {
    årsak: vurdering?.årsak || '',
    konsekvens: vurdering?.konsekvensAvOppfølging,
    hvaSkalRevurderes: vurdering?.opplysningerTilRevurdering,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    årsak: '',
    hvaSkalRevurderes: [],
    konsekvens: '' as Konsekvens, // Vi caster denne da vi ikke ønsker å ødelegge typen på den i løs-behov
  };
}
