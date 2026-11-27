'use client';

import {
  AvklaringsbehovKode,
  FatteVedtakGrunnlag,
  LøsAvklaringsbehovPåBehandling,
  ToTrinnsVurderingGrunn,
} from 'lib/types/types';
import { Button, Label, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  getTrueFalseEllerUndefined,
  JaEllerNei,
  mapBehovskodeTilBehovstype,
} from 'lib/utils/form';
import { brukerErBeslutter } from 'lib/utils/innloggetBruker';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { Alert } from 'components/alert/Alert';
import { BeslutterForm } from 'components/behandlinger/vedtak/beslutter/beslutterform/BeslutterForm';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useConfigForm } from 'components/form/FormHook';
import { useFieldArray } from 'react-hook-form';
import { BeslutterKort } from 'components/behandlinger/vedtak/beslutter/beslutterkort/BeslutterKort';

interface Props {
  grunnlag: FatteVedtakGrunnlag;
  readOnly: boolean;
  behandlingsversjon: number;
}

export interface FormFields {
  godkjent?: JaEllerNei;
  begrunnelse?: string;
  grunner?: ToTrinnsVurderingGrunn[];
  avklaringsbehovKode: AvklaringsbehovKode;
}

export interface BeslutterFormFields {
  vurderinger: FormFields[];
}

export const Beslutter = ({ grunnlag, readOnly, behandlingsversjon }: Props) => {
  const innloggetBruker = useInnloggetBruker();
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovStatus, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('FATTE_VEDTAK');

  const [bekreftedeIndekser, setBekreftedeIndekser] = useState<number[]>([]);

  const { form } = useConfigForm<BeslutterFormFields>({
    vurderinger: {
      type: 'fieldArray',
      defaultValue: grunnlag.vurderinger.map((vurdering) => ({
        avklaringsbehovKode: vurdering.definisjon,
        godkjent: getJaNeiEllerUndefined(vurdering.godkjent),
        begrunnelse: vurdering.begrunnelse ?? '',
        grunner: vurdering.grunner?.map((grunn) => grunn.årsak),
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'vurderinger',
    rules: {
      validate: (vurderinger) => {
        const assessedFields = vurderinger.filter((vurdering) => vurdering.godkjent !== undefined);
        if (!assessedFields.length) {
          return 'Du må gjøre minst én vurdering.';
        }
      },
    },
  });

  const bekreftVurdering = async (index: number) => {
    const godkjent = form.getValues(`vurderinger.${index}.godkjent`);
    if (godkjent === undefined) {
      form.setError(`vurderinger.${index}.godkjent`, {
        type: 'validate',
        message: 'Du må ta stilling til vilkårsvurderingen.',
      });
      return;
    }

    const felterSomSkalValideres =
      godkjent === JaEllerNei.Nei
        ? ([
            `vurderinger.${index}.godkjent`,
            `vurderinger.${index}.begrunnelse`,
            `vurderinger.${index}.grunner`,
          ] as const)
        : ([`vurderinger.${index}.godkjent`] as const);

    if (await form.trigger(felterSomSkalValideres)) {
      const bekreftede = [...bekreftedeIndekser.filter((i) => i !== index), index];
      setBekreftedeIndekser(bekreftede);
    }
  };

  const validerVurderinger = (data: BeslutterFormFields) => {
    let isError = false;

    data.vurderinger.forEach((vurdering, i) => {
      if (vurdering.godkjent === JaEllerNei.Ja) {
        const neste = data.vurderinger[i + 1];
        if (neste && !neste.godkjent) {
          form.setError(`vurderinger.${i + 1}.godkjent`, {
            type: 'validate',
            message: 'Du må ta stilling til alle vilkårsvurderinger hvis du ikke underkjenner.',
          });
          isError = true;
        }
      }
    });
    return !isError;
  };

  const sendInnBeslutning = form.handleSubmit((data) => {
    if (!validerVurderinger(data)) {
      return;
    }

    const assessedFields = data.vurderinger.filter((vurdering) => vurdering.godkjent !== undefined);

    const behovParams: LøsAvklaringsbehovPåBehandling = {
      behandlingVersjon: behandlingsversjon,
      behov: {
        behovstype: Behovstype.FATTE_VEDTAK_KODE,
        vurderinger: assessedFields.map((vurdering) => {
          if (vurdering.godkjent === JaEllerNei.Ja) {
            return {
              definisjon: vurdering.avklaringsbehovKode,
              godkjent: true,
            };
          }
          return {
            definisjon: vurdering.avklaringsbehovKode,
            godkjent: getTrueFalseEllerUndefined(vurdering.godkjent),
            grunner: vurdering.grunner?.map((grunn) => ({ årsak: grunn })),
            begrunnelse: vurdering.begrunnelse,
          };
        }),
      },
      referanse: behandlingsreferanse,
    };

    løsAvklaringsbehov(behovParams);
  });

  return (
    <VStack gap={'space-12'}>
      {grunnlag.harTilgangTilÅSaksbehandle && !readOnly && (
        <form autoComplete={'off'} onSubmit={sendInnBeslutning}>
          <VStack gap={'space-12'}>
            <Label>Beslutter</Label>
            {grunnlag.harGjortVilkårsvurderingerPåBehandling && brukerErBeslutter(innloggetBruker) && !readOnly && (
              <Alert variant={'info'}>Du har jobbet på denne behandlingen tidligere og kan ikke være beslutter.</Alert>
            )}
            {fields.map((field, index) => (
              <BeslutterKort
                key={field.id}
                tittel={mapBehovskodeTilBehovstype(field.avklaringsbehovKode)}
                form={form}
                index={index}
              >
                <div>Her kommer det en oppsummering av vurderingene som blir hentet server side?</div>
                <BeslutterForm
                  form={form}
                  index={index}
                  onBekreft={() => bekreftVurdering(index)}
                  sendInnBeslutning={sendInnBeslutning}
                />
              </BeslutterKort>
            ))}
            {form.formState.errors.vurderinger?.root && (
              <Alert variant={'error'}>{form.formState.errors.vurderinger.root.message}</Alert>
            )}
            <LøsBehovOgGåTilNesteStegStatusAlert
              status={løsAvklaringsbehovStatus}
              løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
            />
            <Button type="submit" className={'fit-content'} loading={løsAvklaringsbehovIsLoading}>
              Bekreft alt
            </Button>
          </VStack>
        </form>
      )}
    </VStack>
  );
};
