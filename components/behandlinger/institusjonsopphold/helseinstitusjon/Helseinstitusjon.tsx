'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/institusjonsopphold/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag, MellomlagretVurdering, Periode } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { HelseinstitusjonOppholdGruppe } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonOppholdGruppe/HelseinstitusjonOppholdGruppe';
import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';

import React, { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { parse } from 'date-fns';
import { useFieldArray } from 'react-hook-form';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';

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
  status?: 'UAVKLART' | 'AVSLÅTT' | 'GODKJENT';
}

type DraftFormFields = Partial<HelseinstitusjonsFormFields>;

export const Helseinstitusjon = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_HELSEINSTITUSJON, initialMellomlagretVurdering);

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
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
      const vurderinger = data.helseinstitusjonsvurderinger.flatMap((opphold) => {
        // Hent alle vurderinger for dette oppholdet
        if (!opphold.vurderinger || opphold.vurderinger.length === 0) {
          throw new Error('Mangler vurderinger for opphold');
        }

        return opphold.vurderinger.map((vurdering) => {
          const { fomDate, tomDate } = parseOgValiderPeriode(vurdering.periode);

          return {
            oppholdId: vurdering.oppholdId,
            begrunnelse: vurdering.begrunnelse,
            harFasteUtgifter: vurdering.harFasteUtgifter === JaEllerNei.Ja,
            faarFriKostOgLosji: vurdering.faarFriKostOgLosji === JaEllerNei.Ja,
            forsoergerEktefelle: vurdering.forsoergerEktefelle === JaEllerNei.Ja,
            periode: {
              fom: formaterDatoForBackend(fomDate),
              tom: formaterDatoForBackend(tomDate),
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
              vurderinger,
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
          alleOpphold={grunnlag.opphold}
        />
      ))}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function parseOgValiderPeriode(periode: Periode) {
  const fomDate = parse(periode.fom, DATO_FORMATER.ddMMyyyy, new Date());
  const tomDate = parse(periode.tom, DATO_FORMATER.ddMMyyyy, new Date());

  // Valider at datoer er satt og gyldige
  if (isNaN(fomDate.getTime())) {
    throw new Error(`Ugyldig fom-dato: ${periode.fom}`);
  }
  if (isNaN(tomDate.getTime())) {
    throw new Error(`Ugyldig tom-dato: ${periode.tom}`);
  }

  // Valider at fom ikke er etter tom
  if (fomDate > tomDate) {
    throw new Error(`Ugyldig periode: fom-dato ${periode.fom} er etter tom-dato ${periode.tom}`);
  }

  // Valider at tom ikke er før fom (redundant, men beholdt for klarhet)
  if (tomDate < fomDate) {
    throw new Error(`Ugyldig periode: tom-dato ${periode.tom} er før fom-dato ${periode.fom}`);
  }

  return { fomDate, tomDate };
}

function mapVurderingToDraftFormFields(
  vurderinger: HelseinstitusjonGrunnlag['vurderinger'],
  opphold: HelseinstitusjonGrunnlag['opphold']
): DraftFormFields {
  return {
    helseinstitusjonsvurderinger: vurderinger.map((item) => {
      const matchendeOpphold = opphold.find((o) => o.oppholdId === item.oppholdId);

      if (item.vurderinger && item.vurderinger.length > 0) {
        return {
          oppholdId: item.oppholdId,
          periode: {
            fom: formaterDatoForFrontend(item.periode.fom),
            tom: formaterDatoForFrontend(item.periode.tom),
          },
          vurderinger: item.vurderinger.map((vurdering) => ({
            oppholdId: vurdering.oppholdId,
            begrunnelse: vurdering.begrunnelse,
            harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
            forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
            faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
            periode: {
              fom: formaterDatoForFrontend(vurdering.periode.fom),
              tom: formaterDatoForFrontend(vurdering.periode.tom),
            },
            status: item.status,
          })),
        };
      }

      return {
        oppholdId: item.oppholdId,
        periode: {
          fom: formaterDatoForFrontend(item.periode.fom),
          tom: formaterDatoForFrontend(item.periode.tom),
        },
        vurderinger: [
          {
            oppholdId: matchendeOpphold?.oppholdId ?? '',
            begrunnelse: '',
            harFasteUtgifter: undefined,
            forsoergerEktefelle: undefined,
            faarFriKostOgLosji: undefined,
            periode: {
              fom: formaterDatoForFrontend(item.periode.fom),
              tom: formaterDatoForFrontend(matchendeOpphold?.avsluttetDato ?? matchendeOpphold?.oppholdFra ?? ''),
            },
            status: 'UAVKLART',
          },
        ],
      };
    }),
  };
}
