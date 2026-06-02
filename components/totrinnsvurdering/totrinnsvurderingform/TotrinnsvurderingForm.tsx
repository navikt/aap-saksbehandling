'use client';

import { TotrinnnsvurderingFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnnsvurderingFelter';
import { Behovstype, getJaNeiEllerUndefined, getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { Alert, Button, Detail, HStack } from '@navikt/ds-react';
import {
  FatteVedtakGrunnlag,
  KvalitetssikringGrunnlag,
  MellomlagretVurdering,
  ToTrinnsVurdering,
} from 'lib/types/types';
import { ToTrinnsVurderingFormFields } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { TotrinnsvurderingVedtaksbrevFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingVedtaksbrevFelter';
import { byggVilkårskortLenke } from 'lib/utils/vilkårskort';
import {
  loggUmamiVarighet,
  loggUmamiVarighetHendelser,
  useUmamiStartTidspunkt,
  useUmamiVarighetHendelser,
} from 'lib/utils/umami';
import { isLocal } from 'lib/utils/environment';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  erKvalitetssikring: boolean;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingsversjon: number;
}

export interface FormFieldsToTrinnsVurdering {
  totrinnsvurderinger: ToTrinnsVurderingFormFields[];
}

type DraftFormFields = Partial<FormFieldsToTrinnsVurdering>;

export const TotrinnsvurderingForm = ({
  grunnlag,
  readOnly,
  erKvalitetssikring,
  initialMellomlagretVurdering,
  behandlingsversjon,
}: Props) => {
  const { saksnummer, behandlingsreferanse } = useParamsMedType();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    erKvalitetssikring ? 'KVALITETSSIKRING' : 'FATTE_VEDTAK'
  );

  const { addHendelse, varighetHendelseRef, hendelseSerieRef } = useUmamiVarighetHendelser(
    erKvalitetssikring ? 'KVALITETSSIKRER_VARIGHET_HENDELSER' : 'BESLUTTER_VARIGHET_HENDELSER'
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt('TOTRINN');

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? mapMellomlagringToDraftFormFields(JSON.parse(initialMellomlagretVurdering.data))
    : mapVurderingToDraftFormFields(grunnlag.vurderinger);

  const { form } = useConfigForm<FormFieldsToTrinnsVurdering>({
    totrinnsvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue.totrinnsvurderinger,
    },
  });

  const { nullstillMellomlagretVurdering, mellomlagretVurdering, slettMellomlagring } = useMellomlagring(
    erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE,
    initialMellomlagretVurdering,
    form
  );

  const { fields } = useFieldArray({
    control: form.control,
    name: 'totrinnsvurderinger',
    rules: {
      validate: (vurderinger) => {
        const assessedFields = vurderinger.filter((vurdering) => vurdering.godkjent !== undefined);
        if (!assessedFields.length) {
          return 'Du må gjøre minst én vurdering.';
        }
      },
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        const assessedFields = data.totrinnsvurderinger.filter((vurdering) => vurdering.godkjent !== undefined);
        let isError = false;
        data.totrinnsvurderinger.forEach((vurdering, i) => {
          if (vurdering.godkjent === JaEllerNei.Ja) {
            const neste = data.totrinnsvurderinger[i + 1];
            if (neste && !neste.godkjent) {
              form.setError(`totrinnsvurderinger.${i + 1}.godkjent`, {
                type: 'validate',
                message: 'Du må ta stilling til alle vilkårsvurderinger hvis ikke du underkjenner.',
              });
              isError = true;
              return;
            }
          }
        });
        if (isError) {
          return;
        }
        løsBehovOgGåTilNesteSteg(
          {
            behandlingVersjon: behandlingsversjon,
            behov: {
              behovstype: erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE,
              vurderinger: assessedFields.map((vurdering) => {
                if (vurdering.godkjent === JaEllerNei.Ja) {
                  return {
                    definisjon: vurdering.definisjon,
                    godkjent: true,
                  };
                } else {
                  return {
                    definisjon: vurdering.definisjon,
                    godkjent: getTrueFalseEllerUndefined(vurdering.godkjent),
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
            referanse: behandlingsreferanse,
          },
          () => {
            loggUmamiVarighet(
              erKvalitetssikring ? 'STEG_BESLUTTER_VARIGHET' : 'STEG_KVALITETSSIKRER_VARIGHET',
              umamiStartTidspunkt,
              Date.now()
            );
            if (!erKvalitetssikring) {
              loggUmamiVarighetHendelser(varighetHendelseRef.current, hendelseSerieRef.current);
            }
            nullstillMellomlagretVurdering();
          }
        );
      })}
      className={'flex-column'}
      autoComplete={'off'}
    >
      {fields.map((field, index) => {
        const link = byggVilkårskortLenke(saksnummer, behandlingsreferanse, field.definisjon as Behovstype);
        if (field.definisjon === Behovstype.SYKDOMSVURDERING_BREV_KODE) {
          return (
            <TotrinnsvurderingVedtaksbrevFelter
              key={field.id}
              form={form}
              index={index}
              field={field}
              erKvalitetssikring={erKvalitetssikring}
              link={link}
              readOnly={readOnly}
              felterOnBlur={addHendelse}
            />
          );
        }
        return (
          <TotrinnnsvurderingFelter
            key={field.id}
            form={form}
            index={index}
            field={field}
            erKvalitetssikring={erKvalitetssikring}
            link={link}
            readOnly={readOnly}
            felterOnBlur={addHendelse}
          />
        );
      })}
      {form.formState.errors.totrinnsvurderinger?.root && (
        <Alert variant={'error'}>{form.formState.errors.totrinnsvurderinger.root.message}</Alert>
      )}
      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
      {!readOnly && (
        <>
          <HStack gap={'space-8'}>
            <Button size={'medium'} className={'fit-content'} loading={isLoading}>
              Bekreft og send videre
            </Button>
            {isLocal() && (
              <Button
                type={'button'}
                size={'medium'}
                className={'fit-content'}
                onClick={() => godkjennAlleTotrinnsvurderinger(form)}
              >
                Godkjenn alle vurderinger
              </Button>
            )}
          </HStack>
          {mellomlagretVurdering && (
            <HStack align={'baseline'}>
              <Detail>{`Utkast lagret ${formaterDatoMedTidspunktForFrontend(mellomlagretVurdering.vurdertDato)} (${mellomlagretVurdering.vurdertAv})`}</Detail>
              <Button
                style={{ marginTop: '-5px', marginBottom: '-5px' }}
                type={'button'}
                size={'small'}
                variant={'tertiary'}
                onClick={() => {
                  slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag.vurderinger)));
                }}
              >
                Slett utkast
              </Button>
            </HStack>
          )}
        </>
      )}
    </form>
  );
};
function mapTrueFalseStringTilJaNei(str: 'true' | 'false') {
  return str === 'true' ? JaEllerNei.Ja : JaEllerNei.Nei;
}
function mapMellomlagringToDraftFormFields(mellomlagring: FormFieldsToTrinnsVurdering): DraftFormFields {
  return {
    totrinnsvurderinger: mellomlagring.totrinnsvurderinger.map((vurdering) => {
      return {
        ...vurdering,
        godkjent:
          // @ts-expect-error migrering for true og false verdier i mellomlagring, endret til JaEllerNei
          vurdering.godkjent === 'true' || vurdering.godkjent === 'false'
            ? mapTrueFalseStringTilJaNei(vurdering.godkjent)
            : vurdering.godkjent,
      };
    }),
  };
}
function mapVurderingToDraftFormFields(vurderinger: ToTrinnsVurdering[]): DraftFormFields {
  return {
    totrinnsvurderinger: vurderinger.map((vurdering) => {
      return {
        definisjon: vurdering.definisjon,
        godkjent: getJaNeiEllerUndefined(vurdering.godkjent),
        begrunnelse: vurdering.begrunnelse || '',
        grunner: vurdering.grunner?.map((grunn) => {
          return grunn.årsak;
        }),
        årsakFritekst: vurdering.grunner?.find((grunn) => grunn.årsakFritekst)?.årsakFritekst || '',
      };
    }),
  };
}

function godkjennAlleTotrinnsvurderinger(form: UseFormReturn<FormFieldsToTrinnsVurdering>) {
  if (isLocal()) {
    const vurderinger = form.getValues('totrinnsvurderinger');
    vurderinger.forEach((_, index) => {
      form.setValue(`totrinnsvurderinger.${index}.godkjent`, JaEllerNei.Ja);
    });
  }
}
