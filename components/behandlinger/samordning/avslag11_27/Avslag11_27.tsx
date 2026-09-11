'use client';

import { VStack } from '@navikt/ds-react';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { parse } from 'date-fns';
import {
  Avslag11_27BrukersYtelse,
  Avslag11_27Grunnlag,
  Avslag11_27Vurdering,
  MellomlagretVurdering,
  TypeBehandling,
  VurderingFormMeta,
} from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { SubmitEvent, SubmitEventHandler, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Avslag11_27KravTabell } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27KravTabell';
import { Avslag11_27KravGruppe } from 'components/behandlinger/samordning/avslag11_27/avslag11_27KravGruppe/Avslag11_27KravGruppe';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  grunnlag: Avslag11_27Grunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  typeBehandling: TypeBehandling;
}

export interface Avslag11_27FormFields {
  selectedReferanser: string[];
  avslag11_27vurderinger: KravMedVurderinger[];
}

export interface KravMedVurderinger {
  vurdering: KravMedVurdering;
}

export interface KravMedVurdering extends VurderingFormMeta {
  referanse: string;
  begrunnelse: string;
  harAnnenFullYtelse: JaEllerNei | undefined;
  brukersYtelse: Avslag11_27BrukersYtelse | undefined;
  brukersYtelseTom: string | undefined;
  harSykepengegrunnlagOver2G: JaEllerNei | undefined;
  harArbeidsgiverSykepengerUtbetaling: JaEllerNei | undefined;
  skalAvslås1127: JaEllerNei | undefined;
}

type DraftFormFields = Partial<Avslag11_27FormFields>;

export const Avslag11_27 = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  initialMellomlagretVurdering,
  typeBehandling,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();

  const { løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovStatus, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('VURDER_AVSLAG_11_27');

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'VURDER_AVSLAG_11_27',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const initialSelectedReferanser = () => {
    const nåværendeIds = new Set((grunnlag.vurderinger ?? []).map((v) => v.referanse));
    const vedtatteIds = new Set((grunnlag.vedtatteVurdering ?? []).map((v) => v.referanse));

    if (grunnlag.krav.length === 1 && nåværendeIds.size === 0 && vedtatteIds.size === 0) {
      return grunnlag.krav.map((krav) => krav.referanse);
    }

    return grunnlag.krav.filter((krav) => nåværendeIds.has(krav.referanse)).map((krav) => krav.referanse);
  };

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag, grunnlag.krav);

  const { form } = useConfigForm<Avslag11_27FormFields>({
    selectedReferanser: {
      type: 'fieldArray',
      defaultValue: defaultValue.selectedReferanser ?? initialSelectedReferanser(),
    },
    avslag11_27vurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue.avslag11_27vurderinger,
    },
  });

  const selectedReferanser: string[] = form.watch('selectedReferanser') ?? [];
  const [lukkTeller, setLukkTeller] = useState<Record<string, number>>({});

  const handleToggle = (referanse: string) => {
    const current = form.getValues('selectedReferanser') ?? [];
    const erValgt = current.includes(referanse);

    if (erValgt) {
      const nåværendeVurdering = (grunnlag.vurderinger ?? []).find((v) => v.referanse === referanse);
      if (nåværendeVurdering) {
        const kravIndex = grunnlag.krav.findIndex((k) => k.referanse === referanse);
        if (kravIndex !== -1) {
          form.setValue(
            `avslag11_27vurderinger.${kravIndex}.vurdering`,
            mapVurderingTilKravVurderingFormField(referanse, nåværendeVurdering)
          );
        }
      }
      setLukkTeller((prev) => ({ ...prev, [referanse]: (prev[referanse] ?? 0) + 1 }));
    }

    form.setValue('selectedReferanser', erValgt ? current.filter((id) => id !== referanse) : [...current, referanse]);

    if (!erValgt) {
      setDeletedReferanser((prev) => {
        const neste = new Set(prev);
        neste.delete(referanse);
        return neste;
      });
    }

    setIngenVurderingerValgtFeil(null);
  };

  const { fields: kravFields } = useFieldArray({
    control: form.control,
    name: 'avslag11_27vurderinger',
  });

  const { slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } = useMellomlagring(
    Behovstype.VURDER_AVSLAG_11_27,
    initialMellomlagretVurdering,
    form
  );

  const [ingenVurderingerValgtFeil, setIngenVurderingerValgtFeil] = useState<string | null>(null);

  const erRevurdering = typeBehandling === 'Revurdering';

  const [deletedReferanser, setDeletedReferanser] = useState<Set<string>>(new Set());

  const harNåværendeVurdering = (referanse: string) =>
    (grunnlag.vurderinger ?? []).some((v) => v.referanse === referanse);

  const finnesIKravgrunnlag = (referanse: string) => grunnlag.krav.some((krav) => krav.referanse === referanse);

  const skalSendeVurdering = (krav: KravMedVurderinger) => {
    const { referanse, begrunnelse } = krav.vurdering;

    if (!selectedReferanser.includes(referanse)) return false;
    if (deletedReferanser.has(referanse)) return false;
    if (!finnesIKravgrunnlag(referanse)) return false;

    const harFyltUtNyVurdering = !!begrunnelse?.trim();
    return harNåværendeVurdering(referanse) || harFyltUtNyVurdering;
  };

  const mapTilVurderingPayload = (krav: KravMedVurderinger) => {
    const vurdering = krav.vurdering;
    const harAnnenFullYtelse = vurdering.harAnnenFullYtelse === JaEllerNei.Ja;

    const harArbeidsgiverSykepengerUtbetaling = getTrueFalseEllerUndefined(
      vurdering.harArbeidsgiverSykepengerUtbetaling
    );

    return {
      referanse: vurdering.referanse,
      begrunnelse: vurdering.begrunnelse,
      harAnnenFullYtelse,
      brukersYtelse: harAnnenFullYtelse ? vurdering.brukersYtelse : undefined,
      brukersYtelseTom:
        harAnnenFullYtelse && vurdering.brukersYtelseTom
          ? formaterDatoForBackend(parse(vurdering.brukersYtelseTom, 'dd.MM.yyyy', new Date()))
          : undefined,
      harSykepengegrunnlagOver2G: harAnnenFullYtelse
        ? vurdering.harSykepengegrunnlagOver2G === JaEllerNei.Ja
        : undefined,
      harArbeidsgiverSykepengerUtbetaling: harAnnenFullYtelse ? harArbeidsgiverSykepengerUtbetaling : undefined,
      skalAvslås1127: harAnnenFullYtelse ? vurdering.skalAvslås1127 === JaEllerNei.Ja : undefined,
    };
  };

  const harMinstEttValgtKravUtenVedtatt = (): boolean => {
    if (erRevurdering) return true;

    const nåværendeKravUtenVedtatt = grunnlag.krav.filter(
      (krav) => !(grunnlag.vedtatteVurdering ?? []).some((v) => v.referanse === krav.referanse)
    );

    if (nåværendeKravUtenVedtatt.length === 0) return true;

    return nåværendeKravUtenVedtatt.some((krav) => selectedReferanser.includes(krav.referanse));
  };

  const validerValgteVurderinger = (): boolean => {
    const erGyldig = harMinstEttValgtKravUtenVedtatt();
    setIngenVurderingerValgtFeil(erGyldig ? null : 'Du må velge minst ett krav å vurdere.');
    return erGyldig;
  };

  const handleSubmit: SubmitEventHandler = (event: SubmitEvent) => {
    form.handleSubmit((data) => {
      if (!validerValgteVurderinger()) {
        return;
      }

      const vurderinger = data.avslag11_27vurderinger.filter(skalSendeVurdering).map(mapTilVurderingPayload);

      løsAvklaringsbehov(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.VURDER_AVSLAG_11_27,
            avslag11_27Vurdering: { vurderinger },
          },
          referanse: behandlingsreferanse,
        },
        () => {
          loggUmamiVarighet('STEG_AVSLAG_11_27_VARIGHET', umamiStartTidspunkt, Date.now());
          closeAllAccordions();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-27 Brukeren har annen full trygdeytelse i en lengre periode etter AAP søknad'}
      steg={'VURDER_AVSLAG_11_27'}
      onSubmit={handleSubmit}
      status={løsAvklaringsbehovStatus}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      isLoading={løsAvklaringsbehovIsLoading}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag, grunnlag.krav)))
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {
        form.reset(
          mellomlagretVurdering
            ? JSON.parse(mellomlagretVurdering.data)
            : {
                selectedReferanser: initialSelectedReferanser(),
                avslag11_27vurderinger: defaultValue.avslag11_27vurderinger,
              }
        );
        setDeletedReferanser(new Set());
        setIngenVurderingerValgtFeil(null);
      }}
    >
      <VStack gap={'space-24'}>
        <Avslag11_27KravTabell
          label={'Bruker har følgende søknader om AAP'}
          avslag11_27krav={grunnlag.krav}
          selectedReferanser={selectedReferanser}
          onToggle={handleToggle}
          ingenVurderingerValgtFeil={ingenVurderingerValgtFeil}
          readonly={formReadOnly}
          vedtatteReferanser={(grunnlag.vedtatteVurdering ?? []).map((v) => v.referanse)}
          vurderteReferanser={[
            ...(grunnlag.vedtatteVurdering ?? []).map((v) => v.referanse),
            ...(grunnlag.vurderinger ?? []).map((v) => v.referanse),
          ]}
        />
        {kravFields.map((kravField, kravIndex) => {
          const faktiskKrav = grunnlag.krav.find((k) => k.referanse === kravField.vurdering.referanse);
          if (!faktiskKrav) return null;

          const nåværendeVurdering = (grunnlag.vurderinger ?? []).some(
            (v) => v.referanse === faktiskKrav.referanse);
          const vedtattVurdering = (grunnlag.vedtatteVurdering ?? []).find(
            (v) => v.referanse === faktiskKrav.referanse
          );

          const erValgt = selectedReferanser.includes(faktiskKrav.referanse);
          const erSlettet = deletedReferanser.has(faktiskKrav.referanse);
          if (!erValgt && !vedtattVurdering && !nåværendeVurdering) return null;

          const sorterteKrav = [...grunnlag.krav].sort(
            (a, b) => new Date(a.søknadsdato).getTime() - new Date(b.søknadsdato).getTime()
          );
          const kravSortIndex = sorterteKrav.findIndex((k) => k.referanse === faktiskKrav.referanse);
          const nesteKravSøknadsdato = sorterteKrav[kravSortIndex + 1]?.søknadsdato;

          return (
            <Avslag11_27KravGruppe
              key={kravField.id}
              form={form}
              kravIndex={kravIndex}
              krav={faktiskKrav}
              vedtattVurdering={vedtattVurdering}
              readonly={formReadOnly}
              accordionsSignal={accordionsSignal}
              erAktivUtenAvbryt={erAktivUtenAvbryt}
              nesteKravSøknadsdato={nesteKravSøknadsdato}
              brukersYtelseAlternativer={grunnlag.brukersYtelseAlternativer.filter(
                (ytelse) => ytelse !== 'FERIE_I_SYKEPENGEPERIODE' && ytelse !== 'SVANGERSKAPSPENGER'
              )}
              visNyVurdering={(erValgt || !!nåværendeVurdering) && !erSlettet}
              lukkTeller={lukkTeller[faktiskKrav.referanse] ?? 0}
              onSlettVurdering={() => {
                setDeletedReferanser((prev) => new Set(prev).add(faktiskKrav.referanse));
                handleToggle(faktiskKrav.referanse);
              }}
            />
          );
        })}
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};

export function mapVurderingTilKravVurderingFormField(
  referanse: string,
  vurdering?: Avslag11_27Vurdering | null
): KravMedVurdering {
  if (!vurdering) {
    return {
      referanse,
      behøverVurdering: true,
      erNyVurdering: true,
      begrunnelse: '',
      harAnnenFullYtelse: undefined,
      brukersYtelse: undefined,
      brukersYtelseTom: undefined,
      harSykepengegrunnlagOver2G: undefined,
      harArbeidsgiverSykepengerUtbetaling: undefined,
      skalAvslås1127: undefined,
    };
  }

  return {
    referanse,
    behøverVurdering: true,
    erNyVurdering: false,
    begrunnelse: vurdering.begrunnelse ?? '',
    harAnnenFullYtelse: getJaNeiEllerUndefined(vurdering.harAnnenFullYtelse),
    brukersYtelse: vurdering.brukersYtelse ?? undefined,
    brukersYtelseTom: vurdering.brukersYtelseTom ? formaterDatoForFrontend(vurdering.brukersYtelseTom) : undefined,
    harSykepengegrunnlagOver2G: getJaNeiEllerUndefined(vurdering.harSykepengegrunnlagOver2G),
    harArbeidsgiverSykepengerUtbetaling: getJaNeiEllerUndefined(vurdering.harArbeidsgiverSykepengerUtbetaling),
    skalAvslås1127: getJaNeiEllerUndefined(vurdering.skalAvslås1127),
  };
}

function mapVurderingToDraftFormFields(
  grunnlag: Avslag11_27Grunnlag,
  krav: Avslag11_27Grunnlag['krav']
): DraftFormFields {
  const nåværendeIds = new Set((grunnlag.vurderinger ?? []).map((v) => v.referanse));
  const vedtatteIds = new Set((grunnlag.vedtatteVurdering ?? []).map((v) => v.referanse));

  const erEnesteUvurderteKrav = krav.length === 1 && nåværendeIds.size === 0 && vedtatteIds.size === 0;

  const selectedReferanser = erEnesteUvurderteKrav
    ? krav.map((k) => k.referanse)
    : krav.filter((k) => nåværendeIds.has(k.referanse)).map((k) => k.referanse);

  return {
    selectedReferanser,
    avslag11_27vurderinger: krav.map((kravItem) => ({
      vurdering: mapVurderingTilKravVurderingFormField(
        kravItem.referanse,
        (grunnlag.vurderinger ?? []).find((v) => v.referanse === kravItem.referanse)
      ),
    })),
  };
}
