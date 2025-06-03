import { TotrinnnsvurderingFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnnsvurderingFelter';
import { Behovstype } from 'lib/utils/form';
import { Alert, Button } from '@navikt/ds-react';
import { FatteVedtakGrunnlag, KvalitetssikringGrunnlag } from 'lib/types/types';
import {
  behovstypeTilVilkårskortLink,
  ToTrinnsVurderingFormFields,
} from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useConfigForm } from 'components/form/FormHook';
import { useRequiredFlyt } from 'hooks/FlytHook';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  link: string;
  erKvalitetssikring: boolean;
  readOnly: boolean;
  behandlingsReferanse: string;
}

export interface FormFieldsToTrinnsVurdering {
  totrinnsvurderinger: ToTrinnsVurderingFormFields[];
}

export const TotrinnsvurderingForm = ({
  grunnlag,
  link,
  readOnly,
  behandlingsReferanse,
  erKvalitetssikring,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    erKvalitetssikring ? 'KVALITETSSIKRING' : 'FATTE_VEDTAK'
  );
  const { flyt } = useRequiredFlyt();

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
        setErrorMessage('');
        const assessedFields = data.totrinnsvurderinger.filter((vurdering) => vurdering.godkjent !== undefined);
        if (!flyt.behandlingVersjon) {
          setErrorMessage('Kunne ikke finne behandlingversjon');
          return;
        }

        if (assessedFields && assessedFields.length > 0) {
          løsBehovOgGåTilNesteSteg({
            behandlingVersjon: flyt.behandlingVersjon,
            behov: {
              behovstype: erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE,
              vurderinger: assessedFields.map((vurdering) => {
                if (vurdering.godkjent === 'true') {
                  return {
                    definisjon: vurdering.definisjon,
                    godkjent: vurdering.godkjent === 'true',
                  };
                } else {
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
                }
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
      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
      {!readOnly && (
        <Button size={'medium'} className={'fit-content'} loading={isLoading}>
          Bekreft
        </Button>
      )}
    </form>
  );
};
