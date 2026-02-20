import { TotrinnnsvurderingFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnnsvurderingFelter';
import { Behovstype, getJaNeiEllerUndefined, getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { Alert, Button, Detail, HStack } from '@navikt/ds-react';
import {
  FatteVedtakGrunnlag,
  KvalitetssikringGrunnlag,
  MellomlagretVurdering,
  ToTrinnsVurdering,
} from 'lib/types/types';
import {
  behovstypeTilVilkårskortLink,
  ToTrinnsVurderingFormFields,
} from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useFieldArray } from 'react-hook-form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { useConfigForm } from 'components/form/FormHook';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { TotrinnsvurderingVedtaksbrevFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingVedtaksbrevFelter';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  link: string;
  erKvalitetssikring: boolean;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface FormFieldsToTrinnsVurdering {
  totrinnsvurderinger: ToTrinnsVurderingFormFields[];
}

type DraftFormFields = Partial<FormFieldsToTrinnsVurdering>;

export const TotrinnsvurderingForm = ({
  grunnlag,
  link,
  readOnly,
  erKvalitetssikring,
  initialMellomlagretVurdering,
}: Props) => {
  const { flyt } = useRequiredFlyt();
  const behandlingsReferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    erKvalitetssikring ? 'KVALITETSSIKRING' : 'FATTE_VEDTAK'
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? mapMellomlagringToDraftFormFields(JSON.parse(initialMellomlagretVurdering.data))
    : mapVurderingToDraftFormFields(grunnlag.vurderinger);

  const { nullstillMellomlagretVurdering, mellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(
      erKvalitetssikring ? Behovstype.KVALITETSSIKRING_KODE : Behovstype.FATTE_VEDTAK_KODE,
      initialMellomlagretVurdering
    );

  const { form } = useConfigForm<FormFieldsToTrinnsVurdering>({
    totrinnsvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue.totrinnsvurderinger,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'totrinnsvurderinger',
    rules: {
      validate: (vurderinger) => {
        const assessedFields = vurderinger.filter((vurdering) => vurdering.godkjent !== undefined);
        if (!flyt.behandlingVersjon) {
          return 'Kunne ikke finne behandlingversjon';
        }
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
            behandlingVersjon: flyt.behandlingVersjon,
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
            referanse: behandlingsReferanse,
          },
          () => nullstillMellomlagretVurdering()
        );
      })}
      className={'flex-column'}
      autoComplete={'off'}
    >
      {fields.map((field, index) => {
        if (field.definisjon === Behovstype.SYKDOMSVURDERING_BREV_KODE) {
          return (
            <TotrinnsvurderingVedtaksbrevFelter
              key={field.id}
              form={form}
              index={index}
              field={field}
              erKvalitetssikring={erKvalitetssikring}
              link={`${link}/${behovstypeTilVilkårskortLink(field.definisjon as Behovstype)}`}
              readOnly={readOnly}
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
            link={`${link}/${behovstypeTilVilkårskortLink(field.definisjon as Behovstype)}`}
            readOnly={readOnly}
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
          <HStack gap={'2'}>
            <Button size={'medium'} className={'fit-content'} loading={isLoading}>
              Bekreft
            </Button>

            <Button
              size={'small'}
              variant={'tertiary'}
              type={'button'}
              onClick={() => lagreMellomlagring(form.watch())}
            >
              Lagre utkast
            </Button>
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
