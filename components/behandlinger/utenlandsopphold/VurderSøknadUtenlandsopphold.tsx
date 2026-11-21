'use client';

import { BodyShort, Label } from '@navikt/ds-react';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkaarskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import {
  MellomlagretVurdering,
  SøknadUtenlandsoppholdGrunnlagResponse,
  SøknadUtenlandsoppholdVurderingDto,
} from 'lib/types/types';
import { alleLandUtenNorgeAlpha2 } from 'lib/utils/countries';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { SubmitEventHandler } from 'react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: SøknadUtenlandsoppholdGrunnlagResponse;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

type Resultat = SøknadUtenlandsoppholdVurderingDto['resultat'];

interface FormFields {
  land: string;
  søknadsperiodeFom: string;
  søknadsperiodeTom: string;
  resultat: Resultat;
  godkjentPeriodeFom: string;
  godkjentPeriodeTom: string;
  antallGodkjenteDager: string;
  begrunnelse: string;
}

type DraftFormFields = Partial<FormFields>;

const DATO_FEIL = 'Datoen må være på formatet dd.mm.åååå.';

const tilBackendDato = (verdi: string) => {
  const dato = parseDatoFraDatePicker(verdi);
  return dato ? formaterDatoForBackend(dato) : undefined;
};

const tilFrontendDato = (verdi?: string) => (verdi ? formaterDatoForFrontend(verdi) : '');

export const VurderSøknadUtenlandsopphold = ({
  behandlingVersjon,
  readOnly,
  grunnlag,
  initialMellomlagretVurdering,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovStatus, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('VURDER_SØKNAD_UTENLANDSOPPHOLD');
  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_SØKNAD_UTENLANDSOPPHOLD',
    initialMellomlagretVurdering
  );

  const vurdering = grunnlag.vurdering;
  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(vurdering);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      land: {
        type: 'select',
        label: 'Land',
        options: alleLandUtenNorgeAlpha2,
        rules: { required: 'Du må velge land.' },
        defaultValue: defaultValues.land,
      },
      søknadsperiodeFom: {
        type: 'date_input',
        label: 'Søknadsperiode fra og med',
        rules: { required: 'Du må oppgi fra-dato for søknadsperioden.' },
        defaultValue: defaultValues.søknadsperiodeFom,
      },
      søknadsperiodeTom: {
        type: 'date_input',
        label: 'Søknadsperiode til og med',
        rules: { required: 'Du må oppgi til-dato for søknadsperioden.' },
        defaultValue: defaultValues.søknadsperiodeTom,
      },
      resultat: {
        type: 'radio',
        label: 'Resultat',
        rules: { required: 'Du må velge et resultat.' },
        options: [
          { label: 'Innvilget', value: 'INNVILGET' },
          { label: 'Delvis innvilget', value: 'DELVIS_INNVILGET' },
          { label: 'Avslått', value: 'AVSLÅTT' },
        ],
        defaultValue: defaultValues.resultat,
      },
      godkjentPeriodeFom: {
        type: 'date_input',
        label: 'Godkjent periode fra og med',
        defaultValue: defaultValues.godkjentPeriodeFom,
      },
      godkjentPeriodeTom: {
        type: 'date_input',
        label: 'Godkjent periode til og med',
        defaultValue: defaultValues.godkjentPeriodeTom,
      },
      antallGodkjenteDager: {
        type: 'number',
        label: 'Antall godkjente dager',
        description: 'Fyll ut godkjent periode, antall dager, eller begge deler.',
        defaultValue: defaultValues.antallGodkjenteDager,
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må skrive en begrunnelse.' },
        defaultValue: defaultValues.begrunnelse,
      },
    },
    { readOnly: formReadOnly }
  );

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    Behovstype.VURDER_SØKNAD_UTENLANDSOPPHOLD_KODE,
    initialMellomlagretVurdering,
    form
  );

  const resultat = form.watch('resultat');
  const skalGodkjennes = resultat === 'INNVILGET' || resultat === 'DELVIS_INNVILGET';

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      const søknadsperiodeFom = tilBackendDato(data.søknadsperiodeFom);
      const søknadsperiodeTom = tilBackendDato(data.søknadsperiodeTom);
      if (!søknadsperiodeFom || !søknadsperiodeTom) {
        form.setError('søknadsperiodeFom', { message: DATO_FEIL });
        return;
      }

      const godkjentFom = skalGodkjennes ? tilBackendDato(data.godkjentPeriodeFom) : undefined;
      const godkjentTom = skalGodkjennes ? tilBackendDato(data.godkjentPeriodeTom) : undefined;
      if (skalGodkjennes && !!data.godkjentPeriodeFom !== !!data.godkjentPeriodeTom) {
        form.setError('godkjentPeriodeFom', { message: 'Oppgi både fra og med og til og med for godkjent periode.' });
        return;
      }

      const harGodkjentPeriode = !!godkjentFom && !!godkjentTom;
      const harGodkjenteDager = !!data.antallGodkjenteDager && Number(data.antallGodkjenteDager) > 0;
      if (skalGodkjennes && !harGodkjentPeriode && !harGodkjenteDager) {
        form.setError('antallGodkjenteDager', {
          message: 'Du må oppgi godkjent periode eller antall godkjente dager.',
        });
        return;
      }

      løsAvklaringsbehov(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.VURDER_SØKNAD_UTENLANDSOPPHOLD_KODE,
            vurdering: {
              land: data.land,
              søknadsperiode: { fom: søknadsperiodeFom, tom: søknadsperiodeTom },
              resultat: data.resultat,
              godkjentPeriode: godkjentFom && godkjentTom ? { fom: godkjentFom, tom: godkjentTom } : undefined,
              antallGodkjenteDager:
                skalGodkjennes && data.antallGodkjenteDager ? Number(data.antallGodkjenteDager) : null,
              begrunnelse: data.begrunnelse,
            },
          },
          referanse: behandlingsreferanse,
        },
        () => {
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading="Søknad om å beholde AAP under opphold i utlandet"
      steg="VURDER_SØKNAD_UTENLANDSOPPHOLD"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={løsAvklaringsbehovStatus}
      isLoading={løsAvklaringsbehovIsLoading}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      visningModus={visningModus}
      visningActions={visningActions}
      vurderingerMeta={vurdering?.vurderingerMeta}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(vurdering)))}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <div>
        <Label>Søknaden ble mottatt</Label>
        <BodyShort>{formaterDatoForFrontend(grunnlag.søknad.mottattDato)}</BodyShort>
      </div>
      <FormField form={form} formField={formFields.land} />
      <FormField form={form} formField={formFields.søknadsperiodeFom} />
      <FormField form={form} formField={formFields.søknadsperiodeTom} />
      <FormField form={form} formField={formFields.resultat} />
      {skalGodkjennes && (
        <>
          <FormField form={form} formField={formFields.godkjentPeriodeFom} />
          <FormField form={form} formField={formFields.godkjentPeriodeTom} />
          <FormField form={form} formField={formFields.antallGodkjenteDager} />
        </>
      )}
      <FormField form={form} formField={formFields.begrunnelse} />
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(
  vurdering: SøknadUtenlandsoppholdGrunnlagResponse['vurdering']
): DraftFormFields {
  return {
    land: vurdering?.land ?? '',
    søknadsperiodeFom: tilFrontendDato(vurdering?.søknadsperiode.fom),
    søknadsperiodeTom: tilFrontendDato(vurdering?.søknadsperiode.tom),
    resultat: vurdering?.resultat,
    godkjentPeriodeFom: tilFrontendDato(vurdering?.godkjentPeriode?.fom),
    godkjentPeriodeTom: tilFrontendDato(vurdering?.godkjentPeriode?.tom),
    antallGodkjenteDager: vurdering?.antallGodkjenteDager?.toString() ?? '',
    begrunnelse: vurdering?.begrunnelse ?? '',
  };
}
