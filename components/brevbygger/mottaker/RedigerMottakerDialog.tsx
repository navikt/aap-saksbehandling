'use client';

import { Box, Button, HGrid, HStack, Modal, Radio, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Mottaker } from 'lib/types/types';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useSWR from 'swr';

import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { MottakerType } from 'components/brevbygger/mottaker/VelgMottakere';
import { clientHentLandkoderIso2 } from 'lib/clientApi';
import { isError, isSuccess } from 'lib/utils/api';

enum Opplysningstype {
  KUN_IDENT = 'KUN_IDENT',
  KUN_ADRESSE = 'KUN_ADRESSE',
  BEGGE = 'BEGGE',
}

interface RedigerMottakerFields {
  opplysningstype?: Opplysningstype;
  ident: string;
  identType: Mottaker['identType'] | string;
  navn: string;
  adresselinje1: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postnummer?: string;
  poststed?: string;
  landkode: string;
}

interface Props {
  target: MottakerType;
  mottaker?: Mottaker;
  onLagre: (target: MottakerType, mottaker: Mottaker) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const finnOpplysningstype = (mottaker?: Mottaker): Opplysningstype | undefined => {
  if (mottaker?.ident && !mottaker?.navnOgAdresse?.adresse) {
    return Opplysningstype.KUN_IDENT;
  } else if (!mottaker?.ident && mottaker?.navnOgAdresse?.adresse) {
    return Opplysningstype.KUN_ADRESSE;
  } else if (mottaker?.ident && mottaker?.navnOgAdresse?.adresse) {
    return Opplysningstype.BEGGE;
  } else return undefined;
};

const tilFormFields = (mottaker?: Mottaker): RedigerMottakerFields => ({
  opplysningstype: finnOpplysningstype(mottaker),
  ident: mottaker?.ident ?? '',
  identType: mottaker?.identType ?? '',
  navn: mottaker?.navnOgAdresse?.navn ?? '',
  adresselinje1: mottaker?.navnOgAdresse?.adresse?.adresselinje1 ?? '',
  adresselinje2: mottaker?.navnOgAdresse?.adresse?.adresselinje2 ?? '',
  adresselinje3: mottaker?.navnOgAdresse?.adresse?.adresselinje3 ?? '',
  postnummer: mottaker?.navnOgAdresse?.adresse?.postnummer ?? '',
  poststed: mottaker?.navnOgAdresse?.adresse?.poststed ?? '',
  landkode: mottaker?.navnOgAdresse?.adresse?.landkode ?? '',
});

export const RedigerMottakerDialog = ({ target, setIsOpen, mottaker, onLagre }: Props) => {
  const { data: landkoderResponse } = useSWR('/api/kodeverk/landkoderiso2', clientHentLandkoderIso2, {
    revalidateOnFocus: false,
  });

  const { control, handleSubmit, setValue } = useForm<RedigerMottakerFields>({
    defaultValues: tilFormFields(mottaker),
    shouldUnregister: true,
  });
  const opplysningstype = useWatch({ control, name: 'opplysningstype' });
  const valgtLandkode = useWatch({ control, name: 'landkode' });
  const visIdentfelter = !!opplysningstype && opplysningstype !== Opplysningstype.KUN_ADRESSE;
  const visAdressefelter = !!opplysningstype && opplysningstype !== Opplysningstype.KUN_IDENT;
  const erNorskAdresse = valgtLandkode === 'NO';

  useEffect(() => {
    if (visAdressefelter && !erNorskAdresse) {
      setValue('postnummer', '');
      setValue('poststed', '');
    }
  }, [erNorskAdresse, setValue, visAdressefelter]);

  useEffect(() => {
    if (!visIdentfelter) {
      setValue('ident', '');
      setValue('identType', '');
    }
  }, [setValue, visIdentfelter]);

  useEffect(() => {
    if (!visAdressefelter) {
      setValue('navn', '');
      setValue('adresselinje1', '');
      setValue('adresselinje2', '');
      setValue('adresselinje3', '');
      setValue('landkode', 'NO');
      setValue('postnummer', '');
      setValue('poststed', '');
    }
  }, [setValue, visAdressefelter]);

  const landkoder = isSuccess(landkoderResponse)
    ? Object.entries(landkoderResponse.data.betydninger)
        .map(([kode, betydninger]) => {
          const beskrivelse = betydninger[0]?.beskrivelser?.nb?.tekst;
          return { label: `${beskrivelse ?? kode} (${kode})`, value: kode };
        })
        .sort((a, b) => a.label.localeCompare(b.label, 'nb'))
    : [];

  const lagre = (felter: RedigerMottakerFields) => {
    const brukerKunIdent = felter.opplysningstype === Opplysningstype.KUN_IDENT;
    const brukerKunAdresse = felter.opplysningstype === Opplysningstype.KUN_ADRESSE;

    const navnOgAdresse = brukerKunIdent
      ? undefined
      : {
          navn: felter.navn,
          adresse: {
            adresselinje1: felter.adresselinje1,
            adresselinje2: felter.adresselinje2 || undefined,
            adresselinje3: felter.adresselinje3 || undefined,
            postnummer: erNorskAdresse ? felter.postnummer : undefined,
            poststed: erNorskAdresse ? felter.poststed : undefined,
            landkode: felter.landkode,
          },
        };

    onLagre(target, {
      ident: brukerKunAdresse ? undefined : felter.ident || undefined,
      identType: brukerKunAdresse
        ? undefined
        : felter.identType
          ? (felter.identType as Mottaker['identType'])
          : undefined,
      navnOgAdresse,
    });
    setIsOpen(false);
  };

  return (
    <Modal open={true} onClose={() => setIsOpen(false)} header={{ heading: 'Rediger mottaker' }}>
      <form onSubmit={handleSubmit(lagre)}>
        <Modal.Body>
          <VStack gap="space-16">
            <Box background="neutral-soft" padding="space-16" borderRadius="8" borderColor="neutral" borderWidth="1">
              <RadioGroupWrapper
                control={control}
                name="opplysningstype"
                label="Hvilke opplysninger vil du registrere?"
                rules={{ required: 'Du må velge opplysningstype.' }}
                size="small"
              >
                <Radio value={Opplysningstype.KUN_IDENT} description="Det vanligste. Distribusjon går automatisk.">
                  Kun ident
                </Radio>
                <Radio value={Opplysningstype.KUN_ADRESSE} description="Kun hvis ident ikke finnes">
                  Kun adresse
                </Radio>
                <Radio value={Opplysningstype.BEGGE} description="For eksempel dødsbo eller utenlandsk adresse">
                  Begge deler
                </Radio>
              </RadioGroupWrapper>
            </Box>

            {visIdentfelter && (
              <HGrid columns={2} gap="space-16">
                <SelectWrapper
                  control={control}
                  name="identType"
                  label="Identtype"
                  size="small"
                  rules={{ required: { value: visIdentfelter, message: 'Du må velge identtype.' } }}
                >
                  <option value="">Velg type ident</option>
                  <option value="FNR">Fødselsnummer</option>
                  <option value="ORGNR">Orgnr.</option>
                  {opplysningstype !== Opplysningstype.KUN_IDENT && <option value="UTL_ORG">Utenlandsk orgnr.</option>}
                </SelectWrapper>

                <TextFieldWrapper
                  name="ident"
                  label="Identifikator"
                  type="text"
                  control={control}
                  rules={{ required: { value: visIdentfelter, message: 'Du må fylle inn identifikator.' } }}
                />
              </HGrid>
            )}

            {visAdressefelter && (
              <>
                <TextFieldWrapper
                  name="navn"
                  label="Navn"
                  type="text"
                  control={control}
                  rules={{ required: { value: visAdressefelter, message: 'Må oppgi navn når adresse brukes' } }}
                />

                <ComboboxWrapper
                  control={control}
                  name="landkode"
                  label="Land"
                  size="small"
                  rules={{ required: { value: visAdressefelter, message: 'Må oppgi land når adresse brukes' } }}
                  options={landkoder}
                />
                {isError(landkoderResponse) && (
                  <Alert variant="warning" size="small">
                    Feil oppsto ved henting av land og landkoder. Prøv å laste siden på nytt.
                  </Alert>
                )}

                <VStack gap="space-8">
                  <TextFieldWrapper
                    name="adresselinje1"
                    label="Adresselinjer"
                    placeholder="Adresselinje 1"
                    type="text"
                    control={control}
                    rules={{
                      required: { value: visAdressefelter, message: 'Må oppgi adresselinje 1 når adresse brukes' },
                    }}
                  />
                  <TextFieldWrapper
                    name="adresselinje2"
                    placeholder="Adresselinje 2"
                    type="text"
                    control={control}
                    hideLabel
                  />
                  <TextFieldWrapper
                    name="adresselinje3"
                    placeholder="Adresselinje 3"
                    type="text"
                    control={control}
                    hideLabel
                  />
                </VStack>

                {erNorskAdresse && (
                  <HGrid columns={'.5fr 1fr'} gap="space-16" align="start">
                    <TextFieldWrapper
                      name="postnummer"
                      label="Postnummer"
                      type="text"
                      control={control}
                      rules={{
                        required: {
                          value: visAdressefelter && erNorskAdresse,
                          message: 'Må oppgi postnummer',
                        },
                        minLength: { value: 4, message: 'Postnummer må være 4 siffer' },
                        maxLength: { value: 4, message: 'Postnummer må være 4 siffer' },
                        pattern: { value: /^[0-9]+$/, message: 'Postnummer kan kun inneholde tall' },
                      }}
                    />
                    <TextFieldWrapper
                      name="poststed"
                      label="Poststed"
                      type="text"
                      control={control}
                      rules={{
                        required: {
                          value: visAdressefelter && erNorskAdresse,
                          message: 'Må oppgi poststed',
                        },
                      }}
                    />
                  </HGrid>
                )}
              </>
            )}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <HStack gap="space-16">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Avbryt
            </Button>
            <Button type="submit">Lagre</Button>
          </HStack>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
