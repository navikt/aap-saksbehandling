'use client';

import { Button, Checkbox, HStack, Modal, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Mottaker } from 'lib/types/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { MottakerType } from 'components/brevbygger/mottaker/VelgMottakere';

interface RedigerMottakerFields {
  ident: string;
  identType: Mottaker['identType'] | string;
  navn: string;
  adresselinje1: string;
  adresselinje2: string;
  adresselinje3: string;
  postnummer: string;
  poststed: string;
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
  landkode: mottaker?.navnOgAdresse?.adresse?.landkode ?? 'NO',
});

export const RedigerMottakerDialog = ({ target, setIsOpen, mottaker, onLagre }: Props) => {
  const [manglerIdent, setManglerIdent] = useState(false);

  const { control, handleSubmit, reset } = useForm<RedigerMottakerFields>({
    defaultValues: tilFormFields(mottaker),
  });

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
            postnummer: felter.postnummer,
            poststed: felter.poststed,
            /*
             * Støtter kun norske adresser enn så lenge.
             * Må gjøre oppslag mot kodeverk for å hente landkode dersom vi skal støtte utenlandske adresser.
             */
            landkode: 'NO',
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
    <Modal open={true} onClose={() => setIsOpen(false)} header={{ heading: 'Rediger mottaker' }}>
      <Modal.Body>
        <VStack gap="space-16">
          <div>
            <HStack gap="space-16">
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
            </HStack>

            <Checkbox
              id="manglerIdent"
              defaultChecked={false}
              onChange={(e) => {
                reset({ ...tilFormFields(mottaker), ident: '', identType: '' });
                setManglerIdent(e.target.checked);
              }}
              size="small"
            >
              Mottaker mangler identifikator / ikke relevant
            </Checkbox>
          </div>
          <TextFieldWrapper
            name="navn"
            label="Navn"
            type="text"
            control={control}
            rules={{ required: { value: manglerIdent, message: 'Må oppgi navn når mottaker mangler identifikator' } }}
          />
          <TextFieldWrapper
            name="adresselinje1"
            label="Adresselinje 1"
            type="text"
            control={control}
            rules={{ required: { value: manglerIdent, message: 'Må oppgi adresse mottaker ikke har identifikator' } }}
          />
          <TextFieldWrapper name="adresselinje2" label="Adresselinje 2" type="text" control={control} />
          <TextFieldWrapper name="adresselinje3" label="Adresselinje 3" type="text" control={control} />
          <TextFieldWrapper
            name="postnummer"
            label="Postnummer"
            type="text"
            control={control}
            rules={{
              required: { value: manglerIdent, message: 'Må oppgi postnummer når mottaker mangler identifikator' },
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
              required: { value: manglerIdent, message: 'Må oppgi poststed når mottaker mangler identifikator' },
            }}
          />
          <Alert variant="info" size="small">
            Støtter foreløpig kun norske adresser.
          </Alert>
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
          Avbryt
        </Button>
        <Button type="button" onClick={handleSubmit(lagre)}>
          Lagre
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
