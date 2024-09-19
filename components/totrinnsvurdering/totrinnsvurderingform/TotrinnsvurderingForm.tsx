import { TotrinnnsvurderingFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnnsvurderingFelter';
import { Behovstype } from 'lib/utils/form';
import { Button } from '@navikt/ds-react';
import { FatteVedtakGrunnlag, KvalitetssikringGrunnlag } from 'lib/types/types';
import {
  behovstypeTilVilkårskortLink,
  ToTrinnsVurderingFormFields,
} from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from '@navikt/aap-felles-react';
import { FieldPath, useFieldArray } from 'react-hook-form';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  link: string;
  erKvalitetssikring: boolean;
  readOnly: boolean;
  behandlingsReferanse: string;
  behandlingVersjon: number;
}

export interface FormFieldsToTrinnsVurdering {
  totrinnsvurderinger: ToTrinnsVurderingFormFields[];
}

export const TotrinnsvurderingForm = ({
  grunnlag,
  link,
  readOnly,
  behandlingsReferanse,
  behandlingVersjon,
  erKvalitetssikring,
}: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg(
    erKvalitetssikring ? 'KVALITETSSIKRING' : 'FATTE_VEDTAK'
  );
  const initialValue: ToTrinnsVurderingFormFields[] = grunnlag.vurderinger.map((vurdering) => {
    return {
      definisjon: vurdering.definisjon,
      harBlittRedigert: false,
    };
  });

  const { form } = useConfigForm<FormFieldsToTrinnsVurdering>({
    totrinnsvurderinger: {
      type: 'fieldArray',
      defaultValue: initialValue,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'totrinnsvurderinger',
  });

  console.log('isdirtyyyy', form.formState.isDirty);
  console.log('dirtyyyyy fields', form.formState.dirtyFields);

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        // Validate all the dirty fields in each form row
        const dirtyFieldNames = fields
          .map((_, index) =>
            Object.keys(form.formState.dirtyFields?.totrinnsvurderinger?.[index] || {}).map(
              (field) => `totrinnsvurderinger.${index}.${field}` as FieldPath<FormFieldsToTrinnsVurdering>
            )
          )
          .flat();

        const isValid = await form.trigger(dirtyFieldNames);

        if (isValid) {
          const validatedData = data.totrinnsvurderinger.filter((_, index) => {
            return Object.keys(form.formState.dirtyFields?.totrinnsvurderinger?.[index] || {}).length > 0;
          });

          løsBehovOgGåTilNesteSteg({
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE,
              vurderinger: validatedData.map((vurdering) => {
                return {
                  definisjon: vurdering.definisjon,
                  godkjent: vurdering.godkjent === 'true',
                  grunner: vurdering.grunner?.map((grunn) => {
                    return {
                      årsak: grunn,
                      årsakFritekst: grunn === 'ANNET' ? vurdering.årsakFritekst : undefined,
                    };
                  }),
                  begrunnelse: vurdering.begrunnelse,
                };
              }),
            },
            referanse: behandlingsReferanse,
          });
        }
      })}
      className={'flex-column'}
    >
      {fields.map((field, index) => (
        <TotrinnnsvurderingFelter
          key={field.id}
          form={form}
          index={index}
          field={field}
          erKvalitetssikring={erKvalitetssikring}
          link={`${link}/${behovstypeTilVilkårskortLink(field.definisjon as Behovstype)}`}
          readOnly={readOnly}
        />
      ))}
      {!readOnly && (
        <Button size={'medium'} className={'fit-content-button'} loading={isLoading}>
          Send inn
        </Button>
      )}
    </form>
  );
};
