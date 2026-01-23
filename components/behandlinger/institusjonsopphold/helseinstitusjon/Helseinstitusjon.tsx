'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/institusjonsopphold/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag, MellomlagretVurdering, Periode } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useFieldArray } from 'react-hook-form';
import { HelseinstitusjonOppholdGruppe } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonOppholdGruppe/HelseinstitusjonOppholdGruppe';
import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';

import React, { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { parse } from 'date-fns';
import { beregnTidligsteReduksjonsdato } from 'lib/utils/institusjonsopphold';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface HelseinstitusjonsFormFields {
  helseinstitusjonsvurderinger: oppholdMedVurdering[];
}

interface oppholdMedVurdering {
  oppholdId: string;
  periode: Periode;
  vurderinger: Vurdering[];
}

interface Vurdering {
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

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_HELSEINSTITUSJON, initialMellomlagretVurdering);

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

  const { fields, remove, insert } = useFieldArray({
    control: form.control,
    name: 'helseinstitusjonsvurderinger',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const vurderinger = data.helseinstitusjonsvurderinger.map((vurdering) => {
        // Valider at datoer er satt
        if (!parse(vurdering.periode.fom, DATO_FORMATER.ddMMyyyy, new Date()) || !parse(vurdering.periode.tom, DATO_FORMATER.ddMMyyyy, new Date())) {
          throw new Error('Periode mangler fom eller tom dato');
        }

        if (parse(vurdering.periode.fom, DATO_FORMATER.ddMMyyyy, new Date()) > parse(vurdering.periode.tom, DATO_FORMATER.ddMMyyyy, new Date())) {
          throw new Error(
            `Ugyldig periode: fom-dato ${vurdering.periode.fom} er etter tom-dato ${vurdering.periode.tom}`
          );
        }

        if (parse(vurdering.periode.tom, DATO_FORMATER.ddMMyyyy, new Date()) < parse(vurdering.periode.fom, DATO_FORMATER.ddMMyyyy, new Date())) {
          throw new Error(
            `Ugyldig periode: tom-dato ${vurdering.periode.tom} er før fom-dato ${vurdering.periode.fom}`
          );
        }

        // Parse datoer
        const fomDate = parse(vurdering.periode.fom, DATO_FORMATER.ddMMyyyy, new Date());
        const tomDate = parse(vurdering.periode.tom, DATO_FORMATER.ddMMyyyy, new Date());

        // Valider at parsing var vellykket
        if (isNaN(fomDate.getTime())) {
          throw new Error(`Ugyldig fom-dato: ${vurdering.periode.fom}`);
        }
        if (isNaN(tomDate.getTime())) {
          throw new Error(`Ugyldig tom-dato: ${vurdering.periode.tom}`);
        }

        return {
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
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const vurderingerPerOpphold = grunnlag.opphold.map((opphold, oppholdIndex) => {
    const vurderinger: Array<{
      field: (typeof fields)[0];
      index: number;
      vurdering: oppholdMedVurdering[];
    }> = [];

    fields.forEach((field, index) => {
      const vurdering = grunnlag.vurderinger.find((v) => v.oppholdId === field.oppholdId);
      const ikkeValgt =
        field.faarFriKostOgLosji === undefined &&
        field.forsoergerEktefelle === undefined &&
        field.harFasteUtgifter === undefined;

      if (ikkeValgt) {
        const nyVurdering = vurdering && {
          ...vurdering,
          status: 'UAVKLART' as 'UAVKLART',
          vurderinger: [] as HelseinstitusjonGrunnlag['vurderinger'][0]['vurderinger'],
        };

        const oppholdId = opphold.oppholdId;
        if (field.oppholdId === oppholdId && nyVurdering) {
          vurderinger.push({ field, index, vurdering: nyVurdering });
        }

      } else {
        const oppholdId = opphold.oppholdId;
        if (field.oppholdId === oppholdId && vurdering) {
          vurderinger.push({ field, index, vurdering: vurdering });
        }
      }
    });

    return {
      opphold,
      vurderinger,
      oppholdIndex,
    };
  });


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

      {vurderingerPerOpphold.map((gruppe) => (
        <HelseinstitusjonOppholdGruppe
          key={`${gruppe.opphold.kildeinstitusjon}-${gruppe.opphold.oppholdFra}`}
          opphold={gruppe.opphold}
          vurderinger={gruppe.vurderinger}
          oppholdIndex={gruppe.oppholdIndex}
          alleOpphold={grunnlag.opphold}
          fields={fields}
          form={form}
          formReadOnly={formReadOnly}
          onRemove={remove}
          onInsert={insert}
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
    helseinstitusjonsvurderinger: vurderinger.flatMap((item) => {
      const matchendeOpphold = opphold.find((o) => o.oppholdId === item.oppholdId);

      // Hvis det finnes vurderinger, bruk dem
      if (item.vurderinger && item.vurderinger.length > 0) {
        return item.vurderinger.map((vurdering) => ({
          oppholdId: vurdering.oppholdId,
          begrunnelse: vurdering.begrunnelse,
          harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
          forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
          faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
          periode: {
            fom: formaterDatoForFrontend(vurdering.periode.fom),
            tom: formaterDatoForFrontend(vurdering.periode.tom),
          },
        }));
      }

      // Ingen vurderinger - beregn tidligste reduksjonsdato
      const tidligsteReduksjonsdato = matchendeOpphold
        ? beregnTidligsteReduksjonsdato(matchendeOpphold.oppholdFra) // TODO Thao: Her må jeg bruke finnRiktigReduksjonsdatoFom
        : formaterDatoForFrontend(item.periode.fom);

      return [
        {
          oppholdId: matchendeOpphold?.oppholdId ?? '', //TODO Thao: Hva skjer hvis vi ikke finner oppholdId her?
          begrunnelse: '',
          harFasteUtgifter: undefined,
          forsoergerEktefelle: undefined,
          faarFriKostOgLosji: undefined,
          periode: {
            fom: tidligsteReduksjonsdato,
            tom: formaterDatoForFrontend(item.periode.tom),
          },
        },
      ];
    }),
  };
}
