'use client';

import { TotrinnnsvurderingFelter } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnnsvurderingFelter';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  getTrueFalseEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { Button, Detail, HStack, VStack } from '@navikt/ds-react';
import {
  FatteVedtakGrunnlag,
  KvalitetssikringGrunnlag,
  MellomlagretVurdering,
  ToTrinnsVurdering,
} from 'lib/types/types';
import { ToTrinnsVurderingFormFields } from 'components/totrinnsvurdering/ToTrinnsvurdering';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useFieldArray } from 'react-hook-form';
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
import { Alert } from 'components/alert/Alert';
import { TotrinnsvurderingHastemarkering } from 'components/totrinnsvurdering/totrinnsvurderingform/beslutterform/TotrinnsvurderingHastemarkering';
import { Markering, MarkeringHaster } from 'lib/types/oppgaveTypes';

import { clientFjernMarkeringForBehandling } from 'lib/clientApi';
import { isLocal } from 'lib/utils/environment';
import { TotrinnsvurderingDevtools } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingDevtools';
import { clientMottattDokumenterLest } from 'lib/oppgaveClientApi';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  erKvalitetssikring: boolean;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingsversjon: number;
  hastemarkering?: Markering;
}

export interface FormFieldsToTrinnsVurdering {
  totrinnsvurderinger: ToTrinnsVurderingFormFields[];
  skalHastemarkeringBeholdes?: JaEllerNei;
}

type DraftFormFields = Partial<FormFieldsToTrinnsVurdering>;

export const TotrinnsvurderingForm = ({
  grunnlag,
  readOnly,
  erKvalitetssikring,
  initialMellomlagretVurdering,
  behandlingsversjon,
  hastemarkering,
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

  const totrinnsvurderinger = defaultValue.totrinnsvurderinger;
  const erBehandlingHastemarkert = hastemarkering !== undefined;
  const skalFjerningAvHastemarkeringVurderes = erBehandlingHastemarkert && erKvalitetssikring;

  const { form } = useConfigForm<FormFieldsToTrinnsVurdering>({
    totrinnsvurderinger: {
      type: 'fieldArray',
      defaultValue: totrinnsvurderinger,
    },
    skalHastemarkeringBeholdes: {
      type: 'radio',
      rules: { required: 'Du må ta stilling til om hastemarkeringen skal følge behandlingen videre.' },
      defaultValue: undefined,
      options: JaEllerNeiOptions,
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
        const manglerVurderingAvHastemarkering =
          data.skalHastemarkeringBeholdes === undefined && skalFjerningAvHastemarkeringVurderes;
        let isError = false;

        data.totrinnsvurderinger.forEach((vurdering, i) => {
          if (vurdering.godkjent === JaEllerNei.Ja) {
            const neste = data.totrinnsvurderinger[i + 1];
            if (neste && !neste.godkjent) {
              form.setError(`totrinnsvurderinger.${i + 1}.godkjent`, {
                type: 'validate',
                message: 'Du må ta stilling til alle vilkårsvurderinger hvis du ikke underkjenner.',
              });
              isError = true;
              return;
            }
          }
        });
        if (
          manglerVurderingAvHastemarkering &&
          data.totrinnsvurderinger.every((vurdering) => vurdering.godkjent === JaEllerNei.Ja)
        ) {
          form.setError(`skalHastemarkeringBeholdes`, {
            type: 'validate',
            message: 'Du må ta stilling til om hastemarkeringen skal følge behandlingen videre.',
          });
          isError = true;
        }
        if (data.skalHastemarkeringBeholdes === JaEllerNei.Nei) {
          await clientFjernMarkeringForBehandling(behandlingsreferanse, { markeringType: MarkeringHaster });
        }
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
            } else {
              clientMottattDokumenterLest(behandlingsreferanse);
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
      {skalFjerningAvHastemarkeringVurderes && (
        <TotrinnsvurderingHastemarkering
          key={crypto.randomUUID()}
          form={form}
          readOnly={readOnly}
          begrunnelse={hastemarkering?.begrunnelse ?? ''}
        />
      )}
      {form.formState.errors.totrinnsvurderinger?.root && (
        <Alert variant={'error'}>{form.formState.errors.totrinnsvurderinger.root.message}</Alert>
      )}
      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
      {!readOnly && (
        <VStack gap="space-8">
          <Button size={'medium'} className={'fit-content'} loading={isLoading}>
            Bekreft og send videre
          </Button>

          {isLocal() && <TotrinnsvurderingDevtools form={form} />}

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
        </VStack>
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
        begrunnelse: getDefaultBegrunnelse(vurdering.begrunnelse, vurdering.årsakFritekst),
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
      const årsakFritekst = vurdering.grunner?.find((grunn) => grunn.årsakFritekst)?.årsakFritekst || '';

      return {
        definisjon: vurdering.definisjon,
        godkjent: getJaNeiEllerUndefined(vurdering.godkjent),
        begrunnelse: getDefaultBegrunnelse(vurdering.begrunnelse, årsakFritekst),
        grunner: vurdering.grunner?.map((grunn) => {
          return grunn.årsak;
        }),
        årsakFritekst: årsakFritekst,
      };
    }),
  };
}

function getDefaultBegrunnelse(begrunnelse: string | undefined | null, årsakFritekst?: string) {
  if (årsakFritekst && !begrunnelse?.includes(årsakFritekst)) {
    return begrunnelse + '\n\nAnnet: ' + årsakFritekst;
  }

  return begrunnelse || '';
}
