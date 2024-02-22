import { BodyShort, Label } from '@navikt/ds-react';

export const RegistrertBehandler = () => {
  return (
    <div>
      <Label as="p">Registrert behandler</Label>
      <BodyShort>Trond Ask</BodyShort>
      <BodyShort>Lillegrensen Legesenter</BodyShort>
      <BodyShort>0123 Legeby, 22 44 66 88</BodyShort>
    </div>
  );
};
