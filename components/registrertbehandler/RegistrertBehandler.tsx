import { BodyShort, Label } from '@navikt/ds-react';

export const RegistrertBehandler = () => {
  return (
    <div>
      <Label as="p" size={'small'}>
        Registrert behandler
      </Label>
      <BodyShort size={'small'}>Trond Ask</BodyShort>
      <BodyShort size={'small'}>Lillegrensen Legesenter</BodyShort>
      <BodyShort size={'small'}>0123 Legeby, 22 44 66 88</BodyShort>
    </div>
  );
};
