'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/institusjonsopphold/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering, MellomlagretVurdering, Periode } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';

import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';

import React, { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { format, parse, subDays } from 'date-fns';
import { useFieldArray } from 'react-hook-form';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { Dato } from 'lib/types/Dato';
import { VStack } from '@navikt/ds-react';
import { HelseinstitusjonOppholdGruppe } from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/helseinstitusjonoppholdgruppe/HelseinstitusjonOppholdGruppe';
import { nb } from 'date-fns/locale';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface HelseinstitusjonsFormFieldsNy {
  helseinstitusjonsvurderinger: OppholdMedVurderinger[];
}

export interface OppholdMedVurderinger {
  oppholdId: string;
  periode: Periode;
  vurderinger: OppholdVurdering[];
}

export interface OppholdVurdering {
  oppholdId: string;
  periode: Periode;
  begrunnelse: string;
  harFasteUtgifter?: JaEllerNei;
  forsoergerEktefelle?: JaEllerNei;
  faarFriKostOgLosji?: JaEllerNei;
  erNyVurdering?: boolean;
}

type DraftFormFields = Partial<HelseinstitusjonsFormFieldsNy>;

export const HelseinstitusjonNy = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
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
    : mapVurderingToDraftFormFields(grunnlag, grunnlag.opphold);

  const { form } = useConfigForm<HelseinstitusjonsFormFieldsNy>({
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

          const fom = vurdering.periode?.fom
            ? formaterDatoForBackend(parse(vurdering.periode.fom, 'dd.MM.yyyy', new Date()))
            : formaterDatoForBackend(parse(opphold.periode.fom, 'dd.MM.yyyy', new Date()));

          const tom = !nesteVurdering
            ? // tom dato for siste vurdering skal alltid være siste dag i oppholdet
              formaterDatoForBackend(parse(vurdering.periode?.tom ?? opphold.periode.tom, 'dd.MM.yyyy', new Date()))
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
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag, grunnlag.opphold)))
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap={'6'}>
        <InstitusjonsoppholdTabell
          label={'Brukeren har følgende institusjonsopphold på helseinstitusjon'}
          beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP-ytelse. '}
          instutisjonsopphold={grunnlag.opphold}
        />

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
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(
  grunnlag: HelseinstitusjonGrunnlag,
  opphold: HelseinstitusjonGrunnlag['opphold']
): DraftFormFields {
  const harTidligerevurderinger = grunnlag.vedtatteVurderinger && grunnlag.vedtatteVurderinger.length > 0;

  return {
    helseinstitusjonsvurderinger: opphold.map((opphold) => {
      const vurderingerForOpphold = grunnlag.vurderinger.find(
        (vurdering) => vurdering.oppholdId === opphold.oppholdId
      )?.vurderinger;

      const oppholdHentetFraGrunnlag = grunnlag.vurderinger.find((v) => v.oppholdId === opphold.oppholdId);

      const vurderinger =
        vurderingerForOpphold && vurderingerForOpphold.length > 0
          ? vurderingerForOpphold?.map((vurdering) => ({
              oppholdId: vurdering.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
              begrunnelse: vurdering.begrunnelse,
              harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
              forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
              faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
              periode: {
                fom: formaterDatoForFrontend(vurdering.periode.fom),
                tom: formaterDatoForFrontend(vurdering.periode.tom),
              },
            }))
          : [
              {
                oppholdId: opphold.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
                begrunnelse: '',
                faarFriKostOgLosji: undefined,
                harFasteUtgifter: undefined,
                forsoergerEktefelle: undefined,
                periode: {
                  fom: formaterDatoForFrontend(oppholdHentetFraGrunnlag?.periode.fom || opphold.oppholdFra),
                  tom: formaterDatoForFrontendMedStøtteForUendeligSlutt(
                    oppholdHentetFraGrunnlag?.periode.tom || opphold?.avsluttetDato || ''
                  ),
                },
              },
            ];

      // Tom vurdering skal ikke legges til dersom det finnes tidligere vurderinger
      const harTidligereVurderingerOgIngenNåværendeVurderinger = harTidligerevurderinger && !vurderingerForOpphold;

      return {
        oppholdId: opphold.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
        periode: {
          fom: formaterDatoForFrontend(oppholdHentetFraGrunnlag?.periode.fom || opphold.oppholdFra),
          tom: formaterDatoForFrontend(oppholdHentetFraGrunnlag?.periode.tom || opphold.avsluttetDato),
        },
        vurderinger: harTidligereVurderingerOgIngenNåværendeVurderinger ? [] : vurderinger,
      };
    }),
  };
}

export function formaterDatoForFrontendMedStøtteForUendeligSlutt(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}
