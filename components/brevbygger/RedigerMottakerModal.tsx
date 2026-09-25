'use client';

import { Button, Checkbox, HStack, Modal, VStack } from '@navikt/ds-react';
import { Mottaker } from 'lib/types/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';

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
  open: boolean;
  tittel: string;
  mottaker?: Mottaker;
  onClose: () => void;
  onLagre: (mottaker: Mottaker) => void;
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

export const RedigerMottakerModal = ({ open, tittel, mottaker, onClose, onLagre }: Props) => {
  const [manglerIdent, setManglerIdent] = useState(false);

  const { control, handleSubmit, reset } = useForm<RedigerMottakerFields>({
    defaultValues: tilFormFields(mottaker),
  });

  // Formen må initialiseres på nytt hver gang en annen mottaker (eller en tom kopimottaker) åpnes i dialogen.
  useEffect(() => {
    if (open) {
      reset(tilFormFields(mottaker));
    }
  }, [open, mottaker, reset]);

  const lagre = (felter: RedigerMottakerFields) => {
    onLagre({
      ident: felter.ident || undefined,
      identType: felter.identType as Mottaker['identType'],
      navnOgAdresse: {
        navn: felter.navn,
        adresse: {
          adresselinje1: felter.adresselinje1,
          adresselinje2: felter.adresselinje2 || undefined,
          adresselinje3: felter.adresselinje3 || undefined,
          postnummer: felter.postnummer || undefined,
          poststed: felter.poststed || undefined,
          landkode: felter.landkode,
        },
      },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} header={{ heading: tittel }}>
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
                label="Ident (fødselsnummer/D-nummer)"
                type="text"
                control={control}
                readOnly={manglerIdent}
              />
            </HStack>

            <Checkbox
              id="manglerIdent"
              value="true"
              onChange={(e) => {
                reset({ ...tilFormFields(mottaker), ident: '', identType: '' });
                setManglerIdent(e.target.checked);
              }}
              size="small"
            >
              Bruker mangler ident / ikke relevant
            </Checkbox>
          </div>
          <TextFieldWrapper
            name="navn"
            label="Navn"
            type="text"
            control={control}
            rules={{ required: 'Du må fylle inn navn.' }}
          />
          <TextFieldWrapper
            name="adresselinje1"
            label="Adresselinje 1"
            type="text"
            control={control}
            rules={{ required: 'Du må fylle inn adresse.' }}
          />
          <TextFieldWrapper name="adresselinje2" label="Adresselinje 2" type="text" control={control} />
          <TextFieldWrapper name="adresselinje3" label="Adresselinje 3" type="text" control={control} />
          <TextFieldWrapper name="postnummer" label="Postnummer" type="text" control={control} />
          <TextFieldWrapper name="poststed" label="Poststed" type="text" control={control} />
          <TextFieldWrapper
            name="landkode"
            label="Landkode"
            type="text"
            control={control}
            rules={{ required: 'Du må fylle inn landkode.' }}
          />
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
        <Button type="button" onClick={handleSubmit(lagre)}>
          Lagre
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
