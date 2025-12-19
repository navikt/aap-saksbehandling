'use client';

import { BodyShort, ExpansionCard, Label, VStack } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/institusjonsopphold/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag, MellomlagretVurdering, Periode } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useFieldArray } from 'react-hook-form';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonsvurdering/Helseinstitusjonsvurdering';
import { formaterDatoForFrontend } from 'lib/utils/date';

import styles from './Helseinstitusjon.module.css';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface HelseinstitusjonsFormFields {
  helseinstitusjonsvurderinger: Vurdering[];
}

interface Vurdering {
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
    : mapVurderingToDraftFormFields(grunnlag.vurderinger);

  const { form } = useConfigForm<HelseinstitusjonsFormFields>({
    helseinstitusjonsvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue.helseinstitusjonsvurderinger,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'helseinstitusjonsvurderinger',
  });

  const oppholdetErMinstFireMaanederOgToMaanederInnI = vurderingMap(grunnlag.vurderinger);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
            helseinstitusjonVurdering: {
              vurderinger: data.helseinstitusjonsvurderinger.map((vurdering) => {
                return {
                  begrunnelse: vurdering.begrunnelse,
                  harFasteUtgifter: vurdering.harFasteUtgifter === JaEllerNei.Ja,
                  faarFriKostOgLosji: vurdering.faarFriKostOgLosji === JaEllerNei.Ja,
                  forsoergerEktefelle: vurdering.forsoergerEktefelle === JaEllerNei.Ja,
                  periode: vurdering.periode,
                };
              }),
            },
          },
          referanse: behandlingsreferanse,
        },
        () => nullstillMellomlagretVurdering()
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
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag.vurderinger)))
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {!oppholdetErMinstFireMaanederOgToMaanederInnI.some((v) => v.isValid) ? (
        <>
          <ExpansionCard
            size={'small'}
            aria-label={'Institusjonsopphold'}
            defaultOpen={true}
            style={{ backgroundColor: 'var(--a-surface-info-subtle)' }}
          >
            <ExpansionCard.Header className={styles.header}>
              <div className={styles.headerContent}>
                <InformationSquareFillIcon />
                <span>Vurdering av institusjonsopphold</span>
              </div>
            </ExpansionCard.Header>

            <ExpansionCard.Content>
              <VStack gap={'3'}>Institusjonsoppholdet varer for kort til å gi reduksjon av AAP.</VStack>
            </ExpansionCard.Content>
          </ExpansionCard>

          <InstitusjonsoppholdTabell
            label={'Brukeren har eller har hatt følgende institusjonsopphold'}
            beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP-ytelse.'}
            instutisjonsopphold={grunnlag.opphold}
          />
        </>
      ) : (
        <>
          <InstitusjonsoppholdTabell
            label={'Brukeren har eller har hatt følgende institusjonsopphold'}
            beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP-ytelse.'}
            instutisjonsopphold={grunnlag.opphold}
          />

          {fields.map((field, index) => {
            return (
              <div key={field.id} className={styles.vurdering}>
                <div>
                  <Label size={'medium'}>Periode</Label>
                  <BodyShort>
                    {formaterDatoForFrontend(field.periode.fom)} - {formaterDatoForFrontend(field.periode.tom)}
                  </BodyShort>
                </div>
                <Helseinstitusjonsvurdering form={form} helseinstitusjonoppholdIndex={index} readonly={formReadOnly} />
              </div>
            );
          })}
        </>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurderinger: HelseinstitusjonGrunnlag['vurderinger']): DraftFormFields {
  return {
    helseinstitusjonsvurderinger: vurderinger.flatMap((item) => {
      if (item.vurderinger && item.vurderinger.length > 0) {
        return item.vurderinger.map((vurdering) => {
          return {
            begrunnelse: vurdering.begrunnelse,
            harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
            forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
            faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
            periode: vurdering.periode,
          };
        });
      } else {
        return [{ begrunnelse: '', periode: item.periode }];
      }
    }),
  };
}

function vurderingMap(vurderinger: HelseinstitusjonGrunnlag['vurderinger']) {
  const now = new Date();

  return vurderinger.map((v) => {
    const fom = new Date(v.periode.fom);
    const tom = new Date(v.periode.tom);

    const durationMonths = monthsBetween(fom, tom);
    const fomAtLeast2MonthsAgo = monthsBetween(fom, now) >= 2;

    return {
      ...v,
      isValid: durationMonths >= 4 && fomAtLeast2MonthsAgo,
    };
  });
}

function monthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}
