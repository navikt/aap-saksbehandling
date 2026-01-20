'use client';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { MellomlagretVurdering, RettighetsperiodeGrunnlag } from 'lib/types/types';
import { addYears, isBefore, parse, startOfDay } from 'date-fns';
import { Alert, BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  readOnly: boolean;
  behandlingVersjon: number;
  grunnlag?: RettighetsperiodeGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

type HarRettOptions = 'Ja' | 'Nei' | 'HarRettIkkeIStandTilÅSøkeTidligere' | 'HarRettMisvisendeOpplysninger';

interface FormFields {
  begrunnelse: string;
  startDato: string;
  harRett: HarRettOptions;
}

type DraftFormfields = Partial<FormFields>;

export const VurderRettighetsperiode = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_RETTIGHETSPERIODE');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.VURDER_RETTIGHETSPERIODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_RETTIGHETSPERIODE',
    mellomlagretVurdering
  );

  const defaultValues: DraftFormfields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const legacyHarRettOption = {
    label: 'Ja',
    value: 'Ja',
  };

  const commonHarRettOptions = [
    {
      label: 'Ja, bruker ha åpenbart ikke vært i stand til å sette fram krav tidligere',
      value: 'HarRettIkkeIStandTilÅSøkeTidligere',
    },
    {
      label: 'Ja, bruker har ikke satt fram krav tidligere fordi trygdens organer har gitt misvisende opplysninger',
      value: 'HarRettMisvisendeOpplysninger',
    },
    {
      label: 'Nei',
      value: 'Nei',
    },
  ];

  const useLegacyOptions = formReadOnly && grunnlag?.vurdering?.harRett === 'Ja';
  const harRettOptions = useLegacyOptions ? [legacyHarRettOption, ...commonHarRettOptions] : commonHarRettOptions;

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        description: 'Vurder om første mulige dato med rett på ytelse skal tilbakedateres etter § 22-13 7. ledd',
        rules: { required: 'Du må begrunne hvorfor starttidspunktet for saken skal endres' },
        defaultValue: defaultValues.begrunnelse,
      },
      harRett: {
        type: 'radio',
        label: 'Skal brukerens rett på ytelse tilbakedateres før søknadstidspunkt?',
        rules: { required: 'Du må ta stilling til om brukeren har rett på AAP fra en annen dato enn søknadsdatoen' },
        options: harRettOptions,
        defaultValue: defaultValues.harRett,
      },
      startDato: {
        type: 'date_input',
        label: 'Bruker har tidligst rett på AAP fra',
        rules: {
          required: 'Du må sette en dato for behandlingen',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
            maksTreAarFoerSoeknadstidspunkt: (v) => {
              let søknadsdato = grunnlag?.søknadsdato;
              if (søknadsdato) {
                const treÅrFørSøknadstidspunkt = addYears(startOfDay(new Date(søknadsdato)), -3);
                const nyStartDato = stringToDate(v as string, 'dd.MM.yyyy');
                if (nyStartDato && isBefore(startOfDay(nyStartDato), treÅrFørSøknadstidspunkt)) {
                  return 'Kan ikke flytte startdato til mer enn 3 år før søknadstidspunktet';
                }
              }
            },
          },
        },
        defaultValue: defaultValues.startDato,
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const harRett = data.harRett !== 'Nei';

      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.VURDER_RETTIGHETSPERIODE,
            rettighetsperiodeVurdering: {
              begrunnelse: data.begrunnelse,
              startDato: harRett ? formaterDatoForBackend(parse(data.startDato, 'dd.MM.yyyy', new Date())) : null,
              harRett: data.harRett,
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const harRettFormValue = form.watch('harRett');
  const harRett = harRettFormValue != null && harRettFormValue !== 'Nei';

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 22-13 syvende ledd. Første mulige dato med rett på ytelse'}
      steg={'VURDER_RETTIGHETSPERIODE'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        );
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={function (): void {
        mellomlagretVurdering
          ? JSON.parse(mellomlagretVurdering.data)
          : mapVurderingToDraftFormFields(grunnlag?.vurdering);
      }}
    >
      <VStack gap={'1'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Søknadsdato
        </BodyShort>
        <BodyShort size={'small'}>{grunnlag?.søknadsdato && formaterDatoForFrontend(grunnlag.søknadsdato)}</BodyShort>
      </VStack>
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <FormField form={form} formField={formFields.harRett} />
      {harRett && (
        <>
          <FormField form={form} formField={formFields.startDato} />
          <HStack>
            <Alert variant={'warning'} size={'small'}>
              Det er ikke støtte for beregning av renter i Kelvin ennå. Følg samme rutine som brukes på Arena-saker (via
              Gosys).
            </Alert>
          </HStack>
        </>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurdering: RettighetsperiodeGrunnlag['vurdering']): DraftFormfields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    harRett: vurdering?.harRett,
    startDato: (vurdering?.startDato && formaterDatoForFrontend(vurdering.startDato)) || undefined,
  };
}

function emptyDraftFormFields(): DraftFormfields {
  return {
    begrunnelse: '',
    startDato: '',
  };
}
