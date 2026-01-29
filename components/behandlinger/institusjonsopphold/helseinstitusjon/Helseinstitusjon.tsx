'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/institusjonsopphold/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering, MellomlagretVurdering, Periode } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { HelseinstitusjonOppholdGruppe } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonOppholdGruppe/HelseinstitusjonOppholdGruppe';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';

import React, { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { parse, subDays } from 'date-fns';
import { useFieldArray } from 'react-hook-form';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { Dato } from 'lib/types/Dato';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface HelseinstitusjonsFormFields {
  helseinstitusjonsvurderinger: oppholdMedVurderinger[];
}

interface oppholdMedVurderinger {
  oppholdId: string;
  periode: Periode;
  vurderinger: Vurdering[];
}

export interface Vurdering {
  oppholdId: string;
  periode: Periode;
  begrunnelse: string;
  harFasteUtgifter?: JaEllerNei;
  forsoergerEktefelle?: JaEllerNei;
  faarFriKostOgLosji?: JaEllerNei;
  erNyVurdering?: boolean;
}

type DraftFormFields = Partial<HelseinstitusjonsFormFields>;

export const Helseinstitusjon = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_HELSEINSTITUSJON, initialMellomlagretVurdering);

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'DU_ER_ET_ANNET_STED',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag.vurderinger, grunnlag.opphold);

  const { form } = useConfigForm<HelseinstitusjonsFormFields>({
    helseinstitusjonsvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue.helseinstitusjonsvurderinger,
    },
  });

  const { fields: oppholdFields } = useFieldArray({
    control: form.control,
    name: 'helseinstitusjonsvurderinger',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const vurderinger: HelseInstiusjonVurdering[] = data.helseinstitusjonsvurderinger.flatMap((opphold) => {
        return opphold.vurderinger.map((vurdering, index) => {
          const nesteVurdering = opphold.vurderinger.at(index + 1);

          const fom = formaterDatoForBackend(parse(vurdering.periode.fom, 'dd.MM.yyyy', new Date()));
          const tom = !nesteVurdering
            ? // tom dato for siste vurdering skal alltid være siste dag i oppholdet
              formaterDatoForBackend(parse(opphold.periode.tom, 'dd.MM.yyyy', new Date()))
            : // tom skal være dagen før fom i neste vurdering
              formaterDatoForBackend(subDays(new Dato(nesteVurdering.periode.fom).dato, 1));

          return {
            oppholdId: vurdering.oppholdId,
            begrunnelse: vurdering.begrunnelse,
            faarFriKostOgLosji: vurdering.faarFriKostOgLosji === JaEllerNei.Ja,
            forsoergerEktefelle: vurdering.forsoergerEktefelle === JaEllerNei.Ja,
            harFasteUtgifter: vurdering.harFasteUtgifter === JaEllerNei.Ja,
            periode: {
              fom: fom,
              tom: tom,
            },
          };
        });
      });

      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
            helseinstitusjonVurdering: {
              vurderinger: vurderinger,
            },
          },
          referanse: behandlingsreferanse,
        },
        () => {
          closeAllAccordions();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-25 Helseinstitusjon'}
      steg={'DU_ER_ET_ANNET_STED'}
      onSubmit={handleSubmit}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag.vurderinger, grunnlag.opphold)))
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <InstitusjonsoppholdTabell
        label={'Brukeren har følgende institusjonsopphold på helseinstitusjon'}
        beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP-ytelse. '}
        instutisjonsopphold={grunnlag.opphold}
      />
      <div style={{ marginTop: 'var(--a-spacing-0)' }} />

      {oppholdFields.map((oppholdField, oppholdIndex) => (
        <HelseinstitusjonOppholdGruppe
          key={oppholdField.id}
          opphold={grunnlag.opphold.find((o) => o.oppholdId === oppholdField.oppholdId)!}
          tidligereVurderinger={
            grunnlag.vedtatteVurderinger.find((vurdering) => vurdering.oppholdId === oppholdField.oppholdId)
              ?.vurderinger
          }
          accordionsSignal={accordionsSignal}
          oppholdIndex={oppholdIndex}
          form={form}
          readonly={formReadOnly}
          erAktivUtenAvbryt={erAktivUtenAvbryt}
        />
      ))}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(
  vurderinger: HelseinstitusjonGrunnlag['vurderinger'],
  opphold: HelseinstitusjonGrunnlag['opphold']
): DraftFormFields {
  return {
    helseinstitusjonsvurderinger: opphold.map((opphold) => {
      const vurderingerForOpphold = vurderinger.find(
        (vurdering) => vurdering.oppholdId === opphold.oppholdId
      )?.vurderinger;

      return {
        oppholdId: opphold.oppholdId,
        periode: {
          fom: formaterDatoForFrontend(opphold.oppholdFra),
          tom: opphold.avsluttetDato ? formaterDatoForFrontend(opphold.avsluttetDato) : '',
        },
        vurderinger: vurderingerForOpphold?.map((vurdering) => ({
          oppholdId: vurdering.oppholdId,
          begrunnelse: vurdering.begrunnelse,
          harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
          forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
          faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
          periode: {
            fom: formaterDatoForFrontend(vurdering.periode.fom),
            tom: formaterDatoForFrontend(vurdering.periode.tom),
          },
        })) || [
          {
            oppholdId: opphold.oppholdId,
            begrunnelse: '',
            faarFriKostOgLosji: undefined,
            harFasteUtgifter: undefined,
            forsoergerEktefelle: undefined,
            periode: {
              fom: '',
              tom: formaterDatoForFrontend(opphold?.avsluttetDato ?? opphold?.oppholdFra ?? ''),
            },
          },
        ],
      };
    }),
  };
}
