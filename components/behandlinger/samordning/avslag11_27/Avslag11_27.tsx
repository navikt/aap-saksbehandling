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
  MellomlagretVurdering,
  VurderingFormMeta,
} from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { SubmitEvent, SubmitEventHandler, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Avslag11_27Krav } from 'components/behandlinger/samordning/avslag11_27/avslag11_27Krav/Avslag11_27Krav';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { Alert } from 'components/alert/Alert';

interface Props {
  grunnlag: Avslag11_27Grunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface Avslag11_27FormFields {
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

export const Avslag11_27 = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
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

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag, grunnlag.krav);

  const { form } = useConfigForm<Avslag11_27FormFields>({
    avslag11_27vurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue.avslag11_27vurderinger,
    },
  });

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

  const [deletedReferanser, setDeletedReferanser] = useState<Set<string>>(new Set());

  const handleSlettVurdering = (referanse: string) => {
    setDeletedReferanser((prev) => new Set(prev).add(referanse));
  };

  const handleLeggTilVurdering = (referanse: string) => {
    setDeletedReferanser((prev) => {
      const oppdatert = new Set(prev);
      oppdatert.delete(referanse);
      return oppdatert;
    });
  };

  const harNåværendeVurdering = (referanse: string) =>
    (grunnlag.vurderinger ?? []).some((v) => v.referanse === referanse);

  const finnesIKravgrunnlag = (referanse: string) => grunnlag.krav.some((krav) => krav.referanse === referanse);

  const erVurderingFaktiskUtfylt = (krav: KravMedVurderinger) => {
    const { harAnnenFullYtelse, begrunnelse } = krav.vurdering;
    return harAnnenFullYtelse !== undefined && !!begrunnelse?.trim();
  };

  const skalSendeVurdering = (krav: KravMedVurderinger) => {
    const { referanse, begrunnelse } = krav.vurdering;

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

  const harMinstEnVurdering = (data: Avslag11_27FormFields): boolean => {
    if (grunnlag.krav.length === 0) return true;

    const harEksisterendeVurdering =
      (grunnlag.vedtatteVurdering ?? []).length > 0 || (grunnlag.vurderinger ?? []).length > 0;

    if (harEksisterendeVurdering) return true;

    return data.avslag11_27vurderinger.some(
      (krav) => !deletedReferanser.has(krav.vurdering.referanse) && erVurderingFaktiskUtfylt(krav)
    );
  };

  const validerVurderinger = (data: Avslag11_27FormFields): boolean => {
    const erGyldig = harMinstEnVurdering(data);
    setIngenVurderingerValgtFeil(erGyldig ? null : 'Du må legge til minst én vurdering.');
    return erGyldig;
  };

  const handleSubmit: SubmitEventHandler = (event: SubmitEvent) => {
    form.handleSubmit((data) => {
      if (!validerVurderinger(data)) {
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
                avslag11_27vurderinger: defaultValue.avslag11_27vurderinger,
              }
        );
        setDeletedReferanser(new Set());
        setIngenVurderingerValgtFeil(null);
      }}
    >
      <VStack gap={'space-24'}>
        {ingenVurderingerValgtFeil && (
          <Alert variant="error" size="small">
            {ingenVurderingerValgtFeil}
          </Alert>
        )}
        {kravFields.map((kravField, kravIndex) => {
          const faktiskKrav = grunnlag.krav.find((k) => k.referanse === kravField.vurdering.referanse);
          if (!faktiskKrav) return null;

          const vedtattVurdering = (grunnlag.vedtatteVurdering ?? []).find(
            (v) => v.referanse === faktiskKrav.referanse
          );
          const nåværendeVurdering = (grunnlag.vurderinger ?? []).find((v) => v.referanse === faktiskKrav.referanse);

          const sorterteKrav = [...grunnlag.krav].sort(
            (a, b) => new Date(a.søknadsdato).getTime() - new Date(b.søknadsdato).getTime()
          );
          const kravSortIndex = sorterteKrav.findIndex((k) => k.referanse === faktiskKrav.referanse);
          const nesteKravSøknadsdato = sorterteKrav[kravSortIndex + 1]?.søknadsdato;

          return (
            <Avslag11_27Krav
              key={kravField.id}
              form={form}
              kravIndex={kravIndex}
              krav={faktiskKrav}
              vedtattVurdering={vedtattVurdering}
              nåværendeVurdering={nåværendeVurdering}
              readonly={formReadOnly}
              accordionsSignal={accordionsSignal}
              erAktivUtenAvbryt={erAktivUtenAvbryt}
              nesteKravSøknadsdato={nesteKravSøknadsdato}
              onSlettVurdering={handleSlettVurdering}
              onLeggTilVurdering={handleLeggTilVurdering}
              brukersYtelseAlternativer={grunnlag.brukersYtelseAlternativer.filter(
                (ytelse) => ytelse !== 'FERIE_I_SYKEPENGEPERIODE' && ytelse !== 'SVANGERSKAPSPENGER'
              )}
            />
          );
        })}
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(
  grunnlag: Avslag11_27Grunnlag,
  krav: Avslag11_27Grunnlag['krav']
): DraftFormFields {
  return {
    avslag11_27vurderinger: krav.map((kravItem) => {
      const nåværende = (grunnlag.vurderinger ?? []).find((v) => v.referanse === kravItem.referanse);

      if (!nåværende) {
        return {
          vurdering: {
            referanse: kravItem.referanse,
            behøverVurdering: true,
            erNyVurdering: true,
            begrunnelse: '',
            harAnnenFullYtelse: undefined,
            brukersYtelse: undefined,
            brukersYtelseTom: undefined,
            harSykepengegrunnlagOver2G: undefined,
            harArbeidsgiverSykepengerUtbetaling: undefined,
            skalAvslås1127: undefined,
          },
        };
      }

      return {
        vurdering: {
          referanse: kravItem.referanse,
          behøverVurdering: true,
          erNyVurdering: !nåværende,
          begrunnelse: nåværende.begrunnelse ?? '',
          harAnnenFullYtelse: nåværende.harAnnenFullYtelse ? JaEllerNei.Ja : JaEllerNei.Nei,
          brukersYtelse: nåværende.brukersYtelse ?? undefined,
          brukersYtelseTom: nåværende.brukersYtelseTom
            ? formaterDatoForFrontend(nåværende.brukersYtelseTom)
            : undefined,
          harSykepengegrunnlagOver2G: getJaNeiEllerUndefined(nåværende.harSykepengegrunnlagOver2G),
          harArbeidsgiverSykepengerUtbetaling: getJaNeiEllerUndefined(nåværende.harArbeidsgiverSykepengerUtbetaling),
          skalAvslås1127: getJaNeiEllerUndefined(nåværende.skalAvslås1127),
        },
      };
    }),
  };
}
