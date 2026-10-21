'use client';

import { Button, Checkbox, HGrid, HStack, Modal, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Mottaker } from 'lib/types/types';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useSWR from 'swr';

import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { MottakerType } from 'components/brevbygger/mottaker/VelgMottakere';
import { clientHentLandkoderIso2 } from 'lib/clientApi';
import { isError, isSuccess } from 'lib/utils/api';

interface RedigerMottakerFields {
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

const tilFormFields = (mottaker?: Mottaker): RedigerMottakerFields => ({
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
  const [manglerIdent, setManglerIdent] = useState(!mottaker?.ident && !!mottaker?.navnOgAdresse?.adresse);
  const [manuellAdresse, setManuellAdresse] = useState(
    !!mottaker?.navnOgAdresse?.adresse || (mottaker?.identType !== 'FNR' && mottaker?.identType !== 'ORGNR')
  );
  const { data: landkoderResponse } = useSWR('/api/kodeverk/landkoderiso2', clientHentLandkoderIso2, {
    revalidateOnFocus: false,
  });

  const { control, handleSubmit, setValue } = useForm<RedigerMottakerFields>({
    defaultValues: tilFormFields(mottaker),
  });
  const valgtLandkode = useWatch({ control, name: 'landkode' });
  const erNorskAdresse = valgtLandkode === 'NO';

  useEffect(() => {
    if (!erNorskAdresse) {
      setValue('postnummer', '');
      setValue('poststed', '');
    }
  }, [erNorskAdresse, setValue]);

  const landkoder = isSuccess(landkoderResponse)
    ? Object.entries(landkoderResponse.data.betydninger)
        .map(([kode, betydninger]) => {
          const beskrivelse = betydninger[0]?.beskrivelser?.nb?.tekst;
          return { label: `${beskrivelse ?? kode} (${kode})`, value: kode };
        })
        .sort((a, b) => a.label.localeCompare(b.label, 'nb'))
    : [];

  const lagre = (felter: RedigerMottakerFields) => {
    const harIdentUtenAdresse = felter.ident && !felter.adresselinje1 && !felter.postnummer && !felter.poststed;

    const navnOgAdresse = harIdentUtenAdresse
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
      ident: felter.ident || undefined,
      identType: felter.identType ? (felter.identType as Mottaker['identType']) : undefined,
      navnOgAdresse,
    });
    setIsOpen(false);
  };

  return (
    <Modal open={true} onClose={() => setIsOpen(false)} header={{ heading: 'Rediger mottaker' }} width="small">
      <form onSubmit={handleSubmit(lagre)}>
        <Modal.Body>
          <VStack gap="space-16">
            <div>
              <HGrid columns={2} gap="space-16">
                <SelectWrapper
                  control={control}
                  name="identType"
                  label="Identtype"
                  size="small"
                  rules={{ required: { value: !manglerIdent, message: 'Du må velge identtype.' } }}
                  readOnly={manglerIdent}
                >
                  <option value="">Velg type ident</option>
                  <option value="FNR">Fødselsnummer</option>
                  <option value="HPRNR">HPRNR</option>
                  <option value="ORGNR">Orgnr.</option>
                  <option value="UTL_ORG">Utenlandsk orgnr.</option>
                </SelectWrapper>

                <TextFieldWrapper
                  name="ident"
                  label="Identifikator"
                  type="text"
                  control={control}
                  rules={{ required: { value: !manglerIdent, message: 'Du må fylle inn identifikator.' } }}
                  readOnly={manglerIdent}
                />
              </HGrid>

              <Checkbox
                id="manglerIdent"
                defaultChecked={manglerIdent}
                onChange={(e) => {
                  setValue('ident', '');
                  setValue('identType', '');
                  setManglerIdent(e.target.checked);
                }}
                size="small"
              >
                Mottaker mangler identifikator
              </Checkbox>

              <Checkbox
                id="manuellAdresse"
                defaultChecked={manuellAdresse || manglerIdent}
                onChange={(e) => {
                  setManuellAdresse(e.target.checked);
                  if (!e.target.checked) {
                    setValue('navn', '');
                    setValue('adresselinje1', '');
                    setValue('adresselinje2', '');
                    setValue('adresselinje3', '');
                    setValue('postnummer', '');
                    setValue('poststed', '');
                    setValue('landkode', '');
                  }
                }}
                size="small"
                readOnly={manglerIdent}
              >
                Skriv adresse manuelt
              </Checkbox>
            </div>

            {(manuellAdresse || manglerIdent) && (
              <>
                <TextFieldWrapper
                  name="navn"
                  label="Navn"
                  type="text"
                  control={control}
                  rules={{
                    required: { value: manglerIdent || manuellAdresse, message: 'Må oppgi navn' },
                  }}
                />

                <ComboboxWrapper
                  control={control}
                  name="landkode"
                  label="Land"
                  size="small"
                  rules={{
                    required: { value: manglerIdent || manuellAdresse, message: 'Må oppgi land' },
                  }}
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
                      required: { value: manglerIdent || manuellAdresse, message: 'Må oppgi adresse' },
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
                  <HGrid columns={'.5fr 1fr'} gap="space-16">
                    <TextFieldWrapper
                      name="postnummer"
                      label="Postnummer"
                      type="text"
                      control={control}
                      rules={{
                        required: {
                          value: (manglerIdent || manuellAdresse) && erNorskAdresse,
                          message: 'Må oppgi postnummer når land er Norge',
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
                          value: (manglerIdent || manuellAdresse) && erNorskAdresse,
                          message: 'Må oppgi poststed når land er Norge',
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
