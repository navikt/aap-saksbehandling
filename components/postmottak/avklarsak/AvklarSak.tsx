'use client';

import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { FormEvent, FormEventHandler } from 'react';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { AvsenderMottakerIdType, FinnSakGrunnlag, Saksinfo } from 'lib/types/postmottakTypes';
import { Alert, Button, Detail, HStack, Label, Radio, VStack } from '@navikt/ds-react';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { FormFieldRadioOptions } from 'components/form/FormHook';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useFieldArray, useForm } from 'react-hook-form';
import { TextFieldToggle } from 'components/form/TextFieldToggle';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { Behovstype } from 'lib/postmottakForm';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  grunnlag: FinnSakGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  knyttTilSak: string;
  journalpostTittel: string;
  avsenderMottaker: {
    id: string;
    navn: string;
  };
  dokumenter: {
    dokumentInfoId: string;
    tittel: string;
  }[];
}

const GENERELL = 'GENERELL';
const NY = 'NY';

function mapVurderingTilValgtOption(vurdering: FinnSakGrunnlag['vurdering']) {
  if (vurdering?.førPåGenerellSak) {
    return GENERELL;
  } else if (vurdering?.saksnummer) {
    return vurdering.saksnummer;
  } else {
    return undefined;
  }
}

export const AvklarSak = ({ behandlingsVersjon, behandlingsreferanse, grunnlag, readOnly }: Props) => {
  const nySakOption = grunnlag.saksinfo.length === 0 ? [{ label: 'Opprett ny sak', value: NY }] : [];

  const form = useForm<FormFields>({
    defaultValues: {
      knyttTilSak: mapVurderingTilValgtOption(grunnlag.vurdering),
      journalpostTittel: grunnlag.journalposttittel || '',
      avsenderMottaker: {
        id: grunnlag.avsenderMottaker?.id || '',
        navn: grunnlag.avsenderMottaker?.navn || '',
      },
      dokumenter: grunnlag.dokumenter.map((dok) => ({
        dokumentInfoId: dok.dokumentInfoId.dokumentInfoId,
        tittel: dok.tittel || '',
      })),
    },
  });

  const { fields: dokumenterFields } = useFieldArray({ name: 'dokumenter', control: form.control });

  const {
    løsBehovOgGåTilNesteSteg,
    status,
    isLoading,
    løsBehovOgGåTilNesteStegError: error,
  } = usePostmottakLøsBehovOgGåTilNesteSteg('AVKLAR_SAK');
  const onSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsVersjon,
        behov: {
          behovstype: Behovstype.FINN_SAK,
          opprettNySak: data.knyttTilSak === NY,
          førPåGenerellSak: data.knyttTilSak === GENERELL,
          saksnummer: data.knyttTilSak === NY || data.knyttTilSak === GENERELL ? null : data.knyttTilSak,
          journalposttittel: data.journalpostTittel,
          avsenderMottaker: {
            id: data.avsenderMottaker.id,
            idType: 'FNR',
            navn: data.avsenderMottaker.navn,
          },
          dokumenter: data.dokumenter,
        },
        // @ts-ignore
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Avklar sak og journalpostdetaljer'}>
      <form onSubmit={onSubmit}>
        <VStack gap={'6'}>
          <ServerSentEventStatusAlert status={status} />

          <RadioGroupWrapper
            label="Hvor skal dokumentet journalføres?"
            rules={{ required: 'Du må svare på hvilken sak dokumentet skal knyttes til' }}
            name={'knyttTilSak'}
            control={form.control}
            readOnly={readOnly}
          >
            {[
              ...nySakOption,
              ...grunnlag.saksinfo.map(mapSaksinfoToOptions),
              { label: 'Journalfør på generell sak', value: GENERELL },
            ].map((option, i) => (
              <Radio key={`knytttilsak-${i}`} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroupWrapper>

          <div>
            <TextFieldToggle
              form={form}
              rules={{ required: 'Journalposttittel må være satt' }}
              name={'journalpostTittel'}
              label="Journalposttittel"
              buttonLabel="Endre journalposttittel"
              readOnly={readOnly}
            />
          </div>

          <VStack gap="2">
            <Label size="small">Dokumenttittel</Label>
            <Detail textColor="subtle">Tittel på dokumenter er synlig for sluttbruker på nav.no</Detail>

            {dokumenterFields.map((_, i) => (
              <TextFieldToggle
                key={`dok-${i}`}
                form={form}
                name={`dokumenter.${i}.tittel`}
                rules={{ required: 'Dokumenttittel må være satt' }}
                buttonLabel="Endre dokumenttittel"
                readOnly={readOnly}
              />
            ))}
          </VStack>

          <VStack gap="2">
            <Label size="small">Avsender</Label>
            <HStack gap="2">
              <TextFieldToggle
                form={form}
                rules={{
                  required: 'Fødselsnummer må være satt',
                  minLength: { value: 11, message: 'Fødselsnummer må bestå av 11 siffer' },
                  maxLength: { value: 11, message: 'Fødselsnummer må bestå av 11 siffer' },
                }}
                name={'avsenderMottaker.id'}
                label="Fødselsnummer"
                readOnly={readOnly}
              />
            </HStack>

            <TextFieldToggle
              form={form}
              rules={{ required: 'Navn må være satt' }}
              name={'avsenderMottaker.navn'}
              label="Navn"
              readOnly={readOnly}
            />
          </VStack>

          {error && <Alert variant="error">{error.message}</Alert>}

          <Button loading={isLoading} className={'fit-content'}>
            Send inn
          </Button>
        </VStack>
      </form>
    </VilkårsKort>
  );
};

function mapSaksinfoToOptions(saksinfo: Saksinfo): FormFieldRadioOptions {
  return {
    value: saksinfo.saksnummer,
    label: saksinfo.saksnummer,
    description: `${formaterDatoForFrontend(saksinfo.periode.fom)} - ${formaterDatoForFrontend(saksinfo.periode.tom)}`,
  };
}
