import { TotrinnnsvurderingFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnnsvurderingFelter';
import { Behovstype } from 'lib/utils/form';
import { Alert, Button } from '@navikt/ds-react';
import { FatteVedtakGrunnlag, KvalitetssikringGrunnlag } from 'lib/types/types';
import {
  behovstypeTilVilkårskortLink,
  ToTrinnsVurderingFormFields,
} from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';
import { useState } from 'react';

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
  const [errorMessage, setErrorMessage] = useState('');
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg(
    erKvalitetssikring ? 'KVALITETSSIKRING' : 'FATTE_VEDTAK'
  );

  const { form } = useConfigForm<FormFieldsToTrinnsVurdering>({
    totrinnsvurderinger: {
      type: 'fieldArray',
      defaultValue: grunnlag.vurderinger.map((vurdering) => {
        return {
          definisjon: vurdering.definisjon,
          godkjent: erGodkjentEllerUndefined(vurdering.godkjent),
          begrunnelse: vurdering.begrunnelse || '',
          grunner: vurdering.grunner?.map((grunn) => {
            return grunn.årsak;
          }),
          årsakFritekst: vurdering.grunner?.find((grunn) => grunn.årsakFritekst)?.årsakFritekst || '',
        };
      }),
    },
  });

  function erGodkjentEllerUndefined(value: undefined | null | boolean): undefined | 'true' | 'false' {
    if (value === undefined || value === null) {
      return undefined;
    }

    return value ? 'true' : 'false';
  }
  const { fields } = useFieldArray({
    control: form.control,
    name: 'totrinnsvurderinger',
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        const dirtyFieldNames = fields
          .map((_, index) =>
            Object.keys(form.formState.dirtyFields?.totrinnsvurderinger?.[index] || {}).map(
              (field) => `totrinnsvurderinger.${index}.${field}`
            )
          )
          .flat();

        if (dirtyFieldNames && dirtyFieldNames.length > 0) {
          const validatedData = data.totrinnsvurderinger.filter((vurderinger, index) => {
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
        } else {
          setErrorMessage('Du må gjøre minst én vurdering.');
        }
      })}
      className={'flex-column'}
      autoComplete={'off'}
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
      {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
      {!readOnly && (
        <Button size={'medium'} className={'fit-content'} loading={isLoading}>
          Send inn
        </Button>
      )}
    </form>
  );
};
