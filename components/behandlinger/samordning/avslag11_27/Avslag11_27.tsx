'use client';

import {
  Avslag11_27BrukersYtelse,
  Avslag11_27Grunnlag,
  MellomlagretVurdering,
  VurderingFormMeta,
} from 'lib/types/types';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami';
import { useConfigForm } from 'components/form/FormHook';
import { useFieldArray } from 'react-hook-form';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { SubmitEvent, SubmitEventHandler, useState } from 'react';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { VStack } from '@navikt/ds-react';
import { Avslag11_27KravTabell } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27KravTabell';
import { Avslag11_27KravGruppe } from 'components/behandlinger/samordning/avslag11_27/avslag11_27KravGruppe/Avslag11_27KravGruppe';

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
  harSykepengegrunnlagOver2G: JaEllerNei | undefined;
  skalAvslås1127: JaEllerNei | undefined;
}

type DraftFormFields = Partial<Avslag11_27FormFields>;

export const Avslag11_27 = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_AVSLAG_11_27');

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

  const [selectedReferanser, setSelectedReferanser] = useState<string[]>(() => {
    const vedtatteIds = (grunnlag.vedtatteVurdering ?? []).map((v) => v.referanse);
    const nåværendeIds = (grunnlag.vurderinger ?? []).map((v) => v.referanse);

    const alleVurderte = new Set(new Set([...vedtatteIds, ...nåværendeIds]));
    return grunnlag.krav
      .filter((krav) => alleVurderte.has(krav.referanse))
      .map((krav) => krav.referanse);
  });

  const handleToggle = (referanse: string) => {
    setSelectedReferanser((prev) =>
      prev.includes(referanse) ? prev.filter((id) => id !== referanse) : [...prev, referanse]
    );
  };

  const handleSubmit: SubmitEventHandler = (event: SubmitEvent) => {
    form.handleSubmit((data) => {
      const vurderinger = data.avslag11_27vurderinger
        .filter((krav) => selectedReferanser.includes(krav.vurdering.referanse))
        .map((krav) => {
          const vurdering = krav.vurdering;
          return {
            referanse: vurdering.referanse,
            begrunnelse: vurdering.begrunnelse,
            harAnnenFullYtelse: vurdering.harAnnenFullYtelse === JaEllerNei.Ja,
            brukersYtelse: vurdering.brukersYtelse,
            harSykepengegrunnlagOver2G: vurdering.harSykepengegrunnlagOver2G === JaEllerNei.Ja,
            skalAvslås1127: vurdering.skalAvslås1127 === JaEllerNei.Ja,
          };
        });

      løsBehovOgGåTilNesteSteg(
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
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag, grunnlag.krav)))
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap={'space-24'}>
        <Avslag11_27KravTabell
          label={'Bruker har følgende søknader om AAP'}
          avslag11_27krav={grunnlag.krav}
          selectedReferanser={selectedReferanser}
          onToggle={handleToggle}
          readonly={formReadOnly}
        />
        {kravFields.map((kravField, kravIndex) => {
          const faktiskKrav = grunnlag.krav[kravIndex];
          if (!selectedReferanser.includes(faktiskKrav.referanse)) return null;

          const vedtattVurdering = (grunnlag.vedtatteVurdering ?? []).find(
            (v) => v.referanse === faktiskKrav.referanse
          ); // FIXME: Thao: Må finne basert på vurdert i behandling

          const nåværendeVurdering = (grunnlag.vurderinger ?? []).find(
            (v) => v.referanse === faktiskKrav.referanse
          );  // FIXME: Thao: Må finne basert på vurdert i behandling

          return (
            <Avslag11_27KravGruppe
              key={kravField.id}
              form={form}
              kravIndex={kravIndex}
              krav={faktiskKrav}
              vedtattVurdering={vedtattVurdering}
              nåværendeVurdering={nåværendeVurdering}
              readonly={formReadOnly}
              accordionsSignal={accordionsSignal}
              erAktivUtenAvbryt={erAktivUtenAvbryt}
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

      //FIXME Thao: Må hente ut basert på vurdert i behandling
      const nåværende = (grunnlag.vurderinger ?? []).find((v) => v.referanse === kravItem.referanse);
      const vedtatt = (grunnlag.vedtatteVurdering ?? []).find((v) => v.referanse === kravItem.referanse);

      const gjeldendeVurdering = nåværende ?? vedtatt;

      if (!gjeldendeVurdering) {
        return {
          vurdering: {
            referanse: kravItem.referanse,
            journalpostId: kravItem.søknadsdokument,
            behøverVurdering: true,
            erNyVurdering: true,
            begrunnelse: '',
            harAnnenFullYtelse: undefined,
            brukersYtelse: undefined,
            harSykepengegrunnlagOver2G: undefined,
            skalAvslås1127: undefined,
          },
        };
      }

      let harSykepengegrunnlagOver2G: JaEllerNei | undefined;
      if (gjeldendeVurdering.harSykepengegrunnlagOver2G !== undefined && gjeldendeVurdering.harSykepengegrunnlagOver2G !== null) {
        harSykepengegrunnlagOver2G = gjeldendeVurdering.harSykepengegrunnlagOver2G ? JaEllerNei.Ja : JaEllerNei.Nei;
      }

      return {
        vurdering: {
          referanse: kravItem.referanse,
          journalpostId: kravItem.søknadsdokument,
          behøverVurdering: true,
          erNyVurdering: !nåværende,
          begrunnelse: gjeldendeVurdering.begrunnelse ?? '',
          harAnnenFullYtelse: gjeldendeVurdering.harAnnenFullYtelse ? JaEllerNei.Ja : JaEllerNei.Nei,
          brukersYtelse: gjeldendeVurdering.brukersYtelse ?? undefined,
          harSykepengegrunnlagOver2G,
          skalAvslås1127: gjeldendeVurdering.skalAvslås1127 ? JaEllerNei.Ja : JaEllerNei.Nei,
        },
      };
    }),
  };
}
