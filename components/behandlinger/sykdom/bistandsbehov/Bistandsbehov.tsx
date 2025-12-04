'use client';

import { BistandsbehovVurdering, BistandsGrunnlag, MellomlagretVurdering, TypeBehandling } from 'lib/types/types';
import {
  Behovstype,
  getJaNeiEllerIkkeBesvart,
  getJaNeiEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { FormEvent } from 'react';
import { Alert, BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: BistandsGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  overgangArbeidEnabled?: Boolean;
}

interface FormFields {
  begrunnelse: string;
  erBehovForAktivBehandling: string;
  erBehovForArbeidsrettetTiltak: string;
  erBehovForAnnenOppfølging?: string;
  overgangBegrunnelse?: string;
  skalVurdereAapIOvergangTilArbeid?: string;
}

type DraftFormFields = Partial<FormFields>;

export const Bistandsbehov = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  typeBehandling,
  initialMellomlagretVurdering,
  overgangArbeidEnabled = false,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_BISTANDSBEHOV_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_BISTANDSBEHOV',
    mellomlagretVurdering
  );

  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const erBehovForAktivBehandlingLabel = 'a: Har brukeren behov for aktiv behandling?';
  const erBehovForArbeidsrettetTiltakLabel = 'b: Har brukeren behov for arbeidsrettet tiltak?';
  const erBehovForAnnenOppfølgingLabel =
    'c: Kan brukeren anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?';
  const vurderAAPIOvergangTilArbeidLabel = 'Har brukeren rett til AAP i perioden som arbeidssøker?';

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurderinger[0]);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: defaultValue?.begrunnelse,
        rules: { required: 'Du må gi en begrunnelse om brukeren har behov for oppfølging' },
      },
      erBehovForAktivBehandling: {
        type: 'radio',
        label: erBehovForAktivBehandlingLabel,
        defaultValue: defaultValue.erBehovForAktivBehandling,
        rules: { required: 'Du må svare på om brukeren har behov for aktiv behandling' },
        options: JaEllerNeiOptions,
      },
      erBehovForArbeidsrettetTiltak: {
        type: 'radio',
        label: erBehovForArbeidsrettetTiltakLabel,
        options: JaEllerNeiOptions,
        defaultValue: defaultValue.erBehovForArbeidsrettetTiltak,
        rules: { required: 'Du må svare på om brukeren har behov for arbeidsrettet tiltak' },
      },
      erBehovForAnnenOppfølging: {
        type: 'radio',
        label: erBehovForAnnenOppfølgingLabel,
        options: JaEllerNeiOptions,
        defaultValue: defaultValue?.erBehovForAnnenOppfølging,
        rules: { required: 'Du må svare på om brukeren anses for å ha en viss mulighet til å komme i arbeid' },
      },
      overgangBegrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: defaultValue?.overgangBegrunnelse || undefined,
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      skalVurdereAapIOvergangTilArbeid: {
        type: 'radio',
        label: vurderAAPIOvergangTilArbeidLabel,
        options: JaEllerNeiOptions,
        defaultValue: defaultValue?.skalVurdereAapIOvergangTilArbeid,
        rules: {
          required: 'Du må svare på om brukeren har rett på AAP i overgang til arbeid',
          validate: (value) => (value === JaEllerNei.Ja ? 'AAP i overgang til arbeid er ikke støttet enda' : undefined),
        },
      },
    },
    { readOnly: formReadOnly, shouldUnregister: true }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
            bistandsVurdering: {
              fom: vurderingenGjelderFra!,
              begrunnelse: data.begrunnelse,
              erBehovForAktivBehandling: data.erBehovForAktivBehandling === JaEllerNei.Ja,
              erBehovForArbeidsrettetTiltak: data.erBehovForArbeidsrettetTiltak === JaEllerNei.Ja,
              erBehovForAnnenOppfølging: data.erBehovForAnnenOppfølging
                ? data.erBehovForAnnenOppfølging === JaEllerNei.Ja
                : undefined,
              ...(bistandsbehovErIkkeOppfylt && {
                skalVurdereAapIOvergangTilArbeid: data.skalVurdereAapIOvergangTilArbeid === JaEllerNei.Ja,
                overgangBegrunnelse: data.overgangBegrunnelse,
              }),
            },
          },
          referanse: behandlingsReferanse,
        },
        () => {
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
        }
      );
    })(event);
  };

  const erBehovForAktivBehandling = form.watch('erBehovForAktivBehandling') === JaEllerNei.Nei;
  const erBehovForArbeidsrettetTiltak = form.watch('erBehovForArbeidsrettetTiltak') === JaEllerNei.Nei;
  const erBehovForAnnenOppfølging = form.watch('erBehovForAnnenOppfølging') === JaEllerNei.Nei;

  const bistandsbehovErIkkeOppfylt =
    erBehovForAktivBehandling && erBehovForArbeidsrettetTiltak && erBehovForAnnenOppfølging;

  const gjeldendeSykdomsvurdering = grunnlag?.gjeldendeSykdsomsvurderinger.at(-1);
  const vurderingenGjelderFra = gjeldendeSykdomsvurdering?.vurderingenGjelderFra;
  const historiskeVurderinger = grunnlag?.historiskeVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid'}
      steg={'VURDER_BISTANDSBEHOV'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.vurderinger[0]?.vurdertAv}
      kvalitetssikretAv={grunnlag?.nyeVurderinger[0]?.kvalitetssikretAv}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(
            grunnlag?.nyeVurderinger[0]
              ? mapVurderingToDraftFormFields(grunnlag.vurderinger[0])
              : emptyDraftFormFields()
          );
        });
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {historiskeVurderinger && historiskeVurderinger.length > 0 && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) =>
            grunnlag?.sisteVedtatteVurderinger.some((gjeldendeVurdering) => deepEqual(v, gjeldendeVurdering, ['dato']))
          }
          getFomDato={(v) => v.fom ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}
      <Veiledning
        defaultOpen={false}
        tekst={
          <div>
            Vilkårene i § 11-6 første ledd bokstav a til c er tre alternative vilkår. Det vil si at det er nok at
            brukeren oppfyller ett av dem for å fylle vilkåret i § 11-6.Først skal du vurdere om vilkårene i bokstav a
            (aktiv behandling) og bokstav b (arbeidsrettet tiltak) er oppfylte. Hvis du svarer ja på ett eller begge
            vilkårene, er § 11-6 oppfylt. Hvis du svarer nei på a og b, må du vurdere om bokstav c er oppfylt. Hvis du
            svarer nei på alle tre vilkårene, er § 11-6 ikke oppfylt.{' '}
            <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_8" target="_blank">
              Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-6 (lovdata.no)
            </Link>
          </div>
        }
      />
      {typeBehandling === 'Revurdering' && (
        <BodyShort>
          Vurderingen gjelder fra {vurderingenGjelderFra && formaterDatoForFrontend(vurderingenGjelderFra)}
        </BodyShort>
      )}
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.erBehovForAktivBehandling} horizontalRadio />
      <FormField form={form} formField={formFields.erBehovForArbeidsrettetTiltak} horizontalRadio />
      {form.watch('erBehovForAktivBehandling') !== JaEllerNei.Ja &&
        form.watch('erBehovForArbeidsrettetTiltak') !== JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.erBehovForAnnenOppfølging} horizontalRadio />
        )}
      {!overgangArbeidEnabled &&
        typeBehandling === 'Revurdering' &&
        !grunnlag?.harOppfylt11_5 &&
        bistandsbehovErIkkeOppfylt && (
          <VStack gap={'4'} as={'section'}>
            <Heading level={'3'} size="small">
              § 11-17 Arbeidsavklaringspenger i perioden som arbeidssøker
            </Heading>
            <FormField form={form} formField={formFields.overgangBegrunnelse} className="begrunnelse" />
            <FormField form={form} formField={formFields.skalVurdereAapIOvergangTilArbeid} horizontalRadio />
            {form.watch('skalVurdereAapIOvergangTilArbeid') === JaEllerNei.Ja && (
              <Alert variant="warning">
                Sett saken på vent og meld i fra til Team AAP at du har fått en § 11-17-sak.
              </Alert>
            )}
          </VStack>
        )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );

  function mapVurderingToDraftFormFields(vurdering?: BistandsbehovVurdering): DraftFormFields {
    return {
      begrunnelse: vurdering?.begrunnelse,
      erBehovForAktivBehandling: getJaNeiEllerUndefined(vurdering?.erBehovForAktivBehandling),
      erBehovForAnnenOppfølging: getJaNeiEllerUndefined(vurdering?.erBehovForAnnenOppfølging),
      overgangBegrunnelse: vurdering?.overgangBegrunnelse || '',
      skalVurdereAapIOvergangTilArbeid: getJaNeiEllerUndefined(vurdering?.skalVurdereAapIOvergangTilArbeid),
      erBehovForArbeidsrettetTiltak: getJaNeiEllerUndefined(vurdering?.erBehovForArbeidsrettetTiltak),
    };
  }

  function emptyDraftFormFields(): DraftFormFields {
    return {
      begrunnelse: '',
      erBehovForAktivBehandling: '',
      erBehovForAnnenOppfølging: '',
      overgangBegrunnelse: '',
      skalVurdereAapIOvergangTilArbeid: '',
      erBehovForArbeidsrettetTiltak: '',
    };
  }

  function byggFelter(vurdering: BistandsbehovVurdering): ValuePair[] {
    const felter = [
      {
        label: vilkårsvurderingLabel,
        value: vurdering.begrunnelse,
      },
      {
        label: erBehovForAktivBehandlingLabel,
        value: getJaNeiEllerIkkeBesvart(vurdering.erBehovForAktivBehandling),
      },
      {
        label: erBehovForArbeidsrettetTiltakLabel,
        value: getJaNeiEllerIkkeBesvart(vurdering.erBehovForArbeidsrettetTiltak),
      },
      {
        label: erBehovForAnnenOppfølgingLabel,
        value: getJaNeiEllerIkkeBesvart(vurdering.erBehovForAnnenOppfølging),
      },
    ];

    if (harVurdertOvergangArbeid(vurdering)) {
      felter.push({
        label: vurderAAPIOvergangTilArbeidLabel,
        value: getJaNeiEllerIkkeBesvart(vurdering.skalVurdereAapIOvergangTilArbeid),
      });
    }

    return felter;
  }

  function harVurdertOvergangArbeid(vurdering: BistandsbehovVurdering) {
    return vurdering.skalVurdereAapIOvergangTilArbeid === false || vurdering.skalVurdereAapIOvergangTilArbeid === true;
  }
};
