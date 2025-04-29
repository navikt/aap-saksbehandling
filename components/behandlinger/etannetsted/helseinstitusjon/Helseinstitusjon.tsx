'use client';

import { BodyShort, Label } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/etannetsted/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag, Periode } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useFieldArray } from 'react-hook-form';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/etannetsted/helseinstitusjon/helseinstitusjonsvurdering/Helseinstitusjonsvurdering';
import { formaterDatoForFrontend } from 'lib/utils/date';

import styles from './Helseinstitusjon.module.css';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
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

export const Helseinstitusjon = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');

  const defaultValue: Vurdering[] = grunnlag.vurderinger.flatMap((item) => {
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
  });

  const { form } = useConfigForm<HelseinstitusjonsFormFields>({
    helseinstitusjonsvurderinger: {
      type: 'fieldArray',
      defaultValue,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'helseinstitusjonsvurderinger',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
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
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'§ 11-25 Helseinstitusjon'}
      steg={'DU_ER_ET_ANNET_STED'}
      onSubmit={handleSubmit}
      status={status}
      resetStatus={resetStatus}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      erAktivtSteg={true}
    >
      <InstitusjonsoppholdTabell
        label={'Bruker har følgende institusjonsopphold på helseinstitusjon'}
        beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP ytelse'}
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
            <Helseinstitusjonsvurdering form={form} helseinstitusjonoppholdIndex={index} readonly={readOnly} />
          </div>
        );
      })}
    </VilkårsKortMedForm>
  );
};
