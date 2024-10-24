'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { HospitalIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Heading, Label } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { InstitusjonsoppholdTabell } from 'components/behandlinger/etannetsted/InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlag, Periode } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/etannetsted/helseinstitusjon/helseinstitusjonsvurdering/Helseinstitusjonsvurdering';
import { formaterDatoForFrontend } from 'lib/utils/date';

import styles from './Helseinstitusjon.module.css';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

export interface HelseinstitusjonsFormFields {
  helseinstitusjonsvurderinger: HelseinstitusjonInterface[];
}

interface HelseinstitusjonInterface {
  periode: Periode;
  vurderinger?: Vurdering[];
}

interface Vurdering {
  begrunnelse: string;
  harFasteUtgifter?: JaEllerNei;
  forsoergerEktefelle?: JaEllerNei;
  faarFriKostOgLosji?: JaEllerNei;
}

export const Helseinstitusjon = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');

  const defaultValue: HelseinstitusjonInterface[] = grunnlag.vurderinger.map((helseinstitusjonsperiode) => {
    return {
      periode: helseinstitusjonsperiode.periode,
      vurderinger:
        helseinstitusjonsperiode.vurderinger && helseinstitusjonsperiode.vurderinger?.length > 0
          ? helseinstitusjonsperiode.vurderinger.map((vurdering) => {
              return {
                begrunnelse: vurdering.begrunnelse,
                harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
                forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
                faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
              };
            })
          : [
              {
                begrunnelse: '',
              },
            ],
    };
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
      console.log(data);
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Helseinstitusjon § 11-25'} steg={'DU_ER_ET_ANNET_STED'} icon={<HospitalIcon />}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_STUDENT'}
        visBekreftKnapp={!readOnly}
      >
        <InstitusjonsoppholdTabell
          label={'Søker har følgende institusjonsopphold på helseinstitusjon'}
          beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP ytelse'}
          instutisjonsopphold={grunnlag.opphold}
        />
        {fields.map((field, index) => {
          return (
            <div key={field.id} className={styles.vurdering}>
              <div>
                <Label size={'small'}>Periode</Label>
                <BodyShort>
                  {formaterDatoForFrontend(field.periode.fom)} - {formaterDatoForFrontend(field.periode.tom)}
                </BodyShort>
              </div>
              <Helseinstitusjonsvurdering form={form} helseinstitusjonoppholdIndex={index} readonly={readOnly} />
            </div>
          );
        })}
        <Alert variant={'info'}>
          <Heading size={'small'}>Institusjonsoppholdet kan medføre redusert ytelse fra dd.mm.yyyy</Heading>
          <BodyShort>
            Innbygger vil få 50% reduksjon i ytelse fra og med dd.mm.yyyy hvis oppholdet vedvarer forbi denne datoen
          </BodyShort>
        </Alert>
      </Form>
    </VilkårsKort>
  );
};
