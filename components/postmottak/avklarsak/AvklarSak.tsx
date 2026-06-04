'use client';

import { SubmitEventHandler } from 'react';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { AvsenderMottakerIdType, FinnSakGrunnlag, JournalpostInfo } from 'lib/types/postmottakTypes';
import { Detail, Label, Radio, VStack } from '@navikt/ds-react';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { useFieldArray, useForm } from 'react-hook-form';
import { TextFieldToggle } from 'components/form/TextFieldToggle';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { Behovstype } from 'lib/postmottakForm';
import { PostmottakVilkårskort } from 'components/postmottak/vilkårskort/PostmottakVilkårskort';
import { usePostmottakVilkårskortVisning } from 'hooks/postmottak/PostmottakVisningHook';
import { Alert } from 'components/alert/Alert';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  grunnlag: FinnSakGrunnlag;
  readOnly: boolean;
  søker?: JournalpostInfo['søker'];
}

/**
 * Ukjent må ikke sendes til backend
 **/
enum IdType {
  FNR = 'FNR',
  ORGNR = 'ORGNR',
  UKJENT = 'UKJENT',
}

interface FormFields {
  knyttTilSak: string;
  journalpostTittel: string;
  avsenderMottaker: {
    id: string;
    idType: IdType;
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

const mapIdType = (type?: string | null) => {
  switch (type) {
    case 'FNR':
      return IdType.FNR;
    case 'ORGNR':
      return IdType.ORGNR;
    default:
      return undefined;
  }
};

export const AvklarSak = ({ behandlingsVersjon, behandlingsreferanse, grunnlag, readOnly, søker }: Props) => {
  const form = useForm<FormFields>({
    defaultValues: {
      knyttTilSak: mapVurderingTilValgtOption(grunnlag.vurdering),
      journalpostTittel: grunnlag.journalposttittel || '',
      avsenderMottaker: grunnlag.kanEndreAvsenderMottaker
        ? {
            id: grunnlag.avsenderMottaker?.id || søker?.ident || '',
            idType: mapIdType(grunnlag.avsenderMottaker?.idType) ?? IdType.FNR,
            navn: grunnlag.avsenderMottaker?.navn || søker?.navn || '',
          }
        : undefined,
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
  const onSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsVersjon,
        behov: {
          behovstype: Behovstype.FINN_SAK,
          opprettNySak: data.knyttTilSak === NY,
          førPåGenerellSak: data.knyttTilSak === GENERELL,
          saksnummer: data.knyttTilSak === NY || data.knyttTilSak === GENERELL ? null : data.knyttTilSak,
          journalposttittel: data.journalpostTittel,
          avsenderMottaker: grunnlag.kanEndreAvsenderMottaker
            ? {
                id: data.avsenderMottaker.id,
                idType: mapIdType(data.avsenderMottaker.idType) as AvsenderMottakerIdType,
                navn: data.avsenderMottaker.navn,
              }
            : undefined,
          dokumenter: data.dokumenter,
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  const { visningActions, formReadOnly, visningModus } = usePostmottakVilkårskortVisning(readOnly, 'AVKLAR_SAK');

  const valgtIdType = form.watch('avsenderMottaker.idType');

  return (
    <PostmottakVilkårskort
      heading={'Avklar sak og journalpostdetaljer'}
      steg={'AVKLAR_SAK'}
      onSubmit={onSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={error}
      knappTekst={'Send inn'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      <VStack gap={'space-24'}>
        <ServerSentEventStatusAlert status={status} />

        <RadioGroupWrapper
          label="Hvor skal dokumentet journalføres?"
          rules={{ required: 'Du må svare på hvilken sak dokumentet skal knyttes til' }}
          name={'knyttTilSak'}
          control={form.control}
          readOnly={formReadOnly}
        >
          {grunnlag.kanOppretteNySak && <Radio value={NY}>Opprett ny sak</Radio>}
          {grunnlag.saksinfo.map((sak) => (
            <Radio key={sak.saksnummer} value={sak.saksnummer}>
              {sak.resultat === 'TRUKKET' ? (
                <>
                  <s>{sak.saksnummer}</s> ({sak.resultat})
                </>
              ) : (
                sak.saksnummer
              )}
            </Radio>
          ))}

          <Radio value={GENERELL}>Journalfør på generell sak</Radio>
        </RadioGroupWrapper>

        <div>
          <TextFieldToggle
            form={form}
            rules={{ required: 'Journalposttittel må være satt' }}
            name={'journalpostTittel'}
            label="Journalposttittel"
            buttonLabel="Endre journalposttittel"
            readOnly={formReadOnly}
          />
        </div>

        <VStack gap="space-8">
          <Label size="small">Dokumenttittel</Label>
          <Detail textColor="subtle">Tittel på dokumenter er synlig for sluttbruker på nav.no</Detail>

          {dokumenterFields.map((_, i) => (
            <TextFieldToggle
              key={`dok-${i}`}
              form={form}
              name={`dokumenter.${i}.tittel`}
              rules={{ required: 'Dokumenttittel må være satt' }}
              buttonLabel="Endre dokumenttittel"
              readOnly={formReadOnly}
            />
          ))}
        </VStack>

        {grunnlag.kanEndreAvsenderMottaker && (
          <VStack gap="space-8">
            <Label size="small">Avsender</Label>
            <RadioGroupWrapper
              label="Avsendertype"
              rules={{ required: 'Du må velge avsendertype' }}
              name={'avsenderMottaker.idType'}
              control={form.control}
              readOnly={formReadOnly}
            >
              <Radio value={IdType.FNR}>Privatperson (Fødselsnummer)</Radio>
              <Radio value={IdType.ORGNR}>Organisasjon (Organisasjonsnummer)</Radio>
              <Radio value={IdType.UKJENT}>Annet</Radio>
            </RadioGroupWrapper>

            {valgtIdType === IdType.FNR && (
              <TextFieldToggle
                form={form}
                rules={{
                  required: 'Fødselsnummer må være satt',
                  minLength: { value: 11, message: 'Fødselsnummer må bestå av 11 siffer' },
                  maxLength: { value: 11, message: 'Fødselsnummer må bestå av 11 siffer' },
                }}
                name={'avsenderMottaker.id'}
                label="Fødselsnummer"
                readOnly={formReadOnly}
              />
            )}

            {valgtIdType === IdType.ORGNR && (
              <TextFieldToggle
                form={form}
                rules={{
                  required: 'Orgnr. må være satt',
                  minLength: { value: 9, message: 'Orgnr. må bestå av 9 siffer' },
                  maxLength: { value: 9, message: 'Orgnr. må bestå av 9 siffer' },
                }}
                name={'avsenderMottaker.id'}
                label="Organisasjonsnummer"
                readOnly={formReadOnly}
              />
            )}

            <TextFieldToggle
              form={form}
              rules={{ required: 'Navn må være satt' }}
              name={'avsenderMottaker.navn'}
              label="Navn"
              readOnly={formReadOnly}
            />
          </VStack>
        )}

        {error && <Alert variant="error">{error.message}</Alert>}
      </VStack>
    </PostmottakVilkårskort>
  );
};
