'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/institusjonsopphold/InstitusjonsoppholdTabell';
import {
  HelseinstitusjonGrunnlag,
  HelseInstiusjonVurdering,
  MellomlagretVurdering,
  Periode,
  VurderingMeta,
} from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { DATO_FORMATER, erUendeligSlutt, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import React, { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { format, parse, subDays } from 'date-fns';
import { useFieldArray } from 'react-hook-form';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { Dato } from 'lib/types/Dato';
import { VStack } from '@navikt/ds-react';
import { HelseinstitusjonOppholdGruppe } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonoppholdgruppe/HelseinstitusjonOppholdGruppe';
import { nb } from 'date-fns/locale';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface HelseinstitusjonsFormFields {
  helseinstitusjonsvurderinger: OppholdMedVurderinger[];
}

export interface OppholdMedVurderinger {
  oppholdId: string;
  periode: Periode;
  tidligsteReduksjonsdato?: string | null;
  vurderinger: OppholdVurdering[];
}

export interface OppholdVurdering extends VurderingMeta {
  oppholdId: string;
  periode: Periode;
  begrunnelse: string;
  harFasteUtgifter?: JaEllerNei;
  forsoergerEktefelle?: JaEllerNei;
  faarFriKostOgLosji?: JaEllerNei;
}

type DraftFormFields = Partial<HelseinstitusjonsFormFields>;

export const Helseinstitusjon = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'DU_ER_ET_ANNET_STED',
    initialMellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag, grunnlag.opphold);

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

  const { slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } = useMellomlagring(
    Behovstype.AVKLAR_HELSEINSTITUSJON,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const parseDato = (dato: string) => parse(dato, 'dd.MM.yyyy', new Date());

      const vurderinger: HelseInstiusjonVurdering[] = data.helseinstitusjonsvurderinger.flatMap((opphold) => {
        return opphold.vurderinger.map((vurdering, index, filtrerteVurderinger) => {
          const nesteVurdering = filtrerteVurderinger.at(index + 1);

          const fom = vurdering.periode?.fom
            ? formaterDatoForBackend(parseDato(vurdering.periode.fom))
            : formaterDatoForBackend(parseDato(opphold.periode.fom));

          const tom = nesteVurdering
            ? formaterDatoForBackend(subDays(new Dato(nesteVurdering.periode.fom).dato, 1))
            : formaterDatoForBackend(parseDato(opphold.periode.tom));

          return {
            oppholdId: vurdering.oppholdId,
            begrunnelse: vurdering.begrunnelse,
            faarFriKostOgLosji: vurdering.faarFriKostOgLosji === JaEllerNei.Ja,
            forsoergerEktefelle: vurdering.forsoergerEktefelle === JaEllerNei.Ja,
            harFasteUtgifter: vurdering.harFasteUtgifter === JaEllerNei.Ja,
            periode: { fom, tom },
          };
        });
      });

      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
            helseinstitusjonVurdering: { vurderinger },
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
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-25 Helseinstitusjon'}
      steg={'DU_ER_ET_ANNET_STED'}
      onSubmit={handleSubmit}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
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

        {oppholdFields.map((oppholdField, oppholdIndex) => {
          const faktiskOpphold = grunnlag.opphold.find((o) => o.oppholdId === oppholdField.oppholdId)!;
          const skalJustere = skalJustereVedtatteVurderinger(grunnlag, oppholdField.oppholdId);

          const tidligereVurderinger = grunnlag.vedtatteVurderinger
            .filter((v) => v.oppholdId === oppholdField.oppholdId)
            .flatMap((v) => v.vurderinger || []);

          return (
            <HelseinstitusjonOppholdGruppe
              key={oppholdField.id}
              opphold={faktiskOpphold}
              tidligereVurderinger={tidligereVurderinger}
              accordionsSignal={accordionsSignal}
              oppholdIndex={oppholdIndex}
              form={form}
              readonly={formReadOnly}
              erAktivUtenAvbryt={erAktivUtenAvbryt}
              skalJustereVedtatteVurderinger={skalJustere}
            />
          );
        })}
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};

function skalJustereVedtatteVurderinger(grunnlag: HelseinstitusjonGrunnlag, oppholdId: string): boolean {
  if (grunnlag.vedtatteVurderinger.length === 0) return false;

  const opphold = grunnlag.opphold.find((o) => o.oppholdId === oppholdId);
  if (!opphold || erUendeligSlutt(opphold.avsluttetDato)) return false;

  const harNyeVurderinger = grunnlag.vurderinger.some((v) => v.oppholdId === oppholdId);
  if (harNyeVurderinger) return false;

  const vedtatteForOpphold = grunnlag.vedtatteVurderinger.find((v) => v.oppholdId === oppholdId)?.vurderinger;
  if (!vedtatteForOpphold || vedtatteForOpphold.length === 0) return false;

  const sisteVedtatteTom = vedtatteForOpphold[vedtatteForOpphold.length - 1].periode.tom;
  return erUendeligSlutt(sisteVedtatteTom) || sisteVedtatteTom > opphold.avsluttetDato;
}

function mapVurderingToDraftFormFields(
  grunnlag: HelseinstitusjonGrunnlag,
  opphold: HelseinstitusjonGrunnlag['opphold']
): DraftFormFields {
  const harTidligerevurderinger = grunnlag.vedtatteVurderinger.length > 0;

  return {
    helseinstitusjonsvurderinger: opphold.map((opphold) => {
      const vurderingerForOpphold = grunnlag.vurderinger.find((v) => v.oppholdId === opphold.oppholdId)?.vurderinger;

      const vedtatteVurderingerForOpphold = grunnlag.vedtatteVurderinger.find(
        (v) => v.oppholdId === opphold.oppholdId
      )?.vurderinger;

      const oppholdAvsluttetDato = formaterDatoForFrontendMedStøtteForUendeligSlutt(opphold.avsluttetDato);
      const skalJustere = skalJustereVedtatteVurderinger(grunnlag, opphold.oppholdId || '');

      let vurderinger: OppholdVurdering[];

      if (vurderingerForOpphold && vurderingerForOpphold.length > 0) {
        vurderinger = vurderingerForOpphold.map((vurdering) => ({
          oppholdId: vurdering.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
          begrunnelse: vurdering.begrunnelse,
          harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
          forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
          faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
          periode: {
            fom: formaterDatoForFrontend(vurdering.periode.fom),
            tom: formaterDatoForFrontend(vurdering.periode.tom),
          },
          vurdertAv: vurdering.vurdertAv,
          erNyVurdering: false,
          behøverVurdering: false,
        }));
      } else if (skalJustere && vedtatteVurderingerForOpphold) {
        vurderinger = [];
      } else {
        vurderinger = [
          {
            oppholdId: opphold.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
            begrunnelse: '',
            faarFriKostOgLosji: undefined,
            harFasteUtgifter: undefined,
            forsoergerEktefelle: undefined,
            periode: { fom: '', tom: oppholdAvsluttetDato },
            erNyVurdering: true,
            behøverVurdering: false,
          },
        ];
      }

      const harTidligereVurderingerOgIngenNåværendeVurderinger =
        harTidligerevurderinger && !vurderingerForOpphold && !skalJustere;

      return {
        oppholdId: opphold.oppholdId || '',
        periode: {
          fom: formaterDatoForFrontend(opphold.oppholdFra),
          tom: oppholdAvsluttetDato,
        },
        tidligsteReduksjonsdato: opphold.tidligsteReduksjonsdato,
        vurderinger: harTidligereVurderingerOgIngenNåværendeVurderinger ? [] : vurderinger,
      };
    }),
  };
}

export function formaterDatoForFrontendMedStøtteForUendeligSlutt(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}
