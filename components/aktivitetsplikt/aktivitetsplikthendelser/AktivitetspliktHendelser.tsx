import { AktivitetspliktHendelserTabell } from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell';
import { AktivitetspliktHendelse } from 'lib/types/types';
import { BodyShort, Label } from '@navikt/ds-react';

export type AktivitetspliktHendelserMedFormId = AktivitetspliktHendelse & { id: string };

interface Props {
  hendelser?: AktivitetspliktHendelserMedFormId[];
}

export const AktivitetspliktHendelser = ({ hendelser }: Props) => {
  return (
    <section className={'flex-column'}>
      <Label size={'medium'}>Tidligere brudd på aktivitetsplikten</Label>
      {hendelser && hendelser.length > 0 ? (
        <AktivitetspliktHendelserTabell aktivitetspliktHendelser={hendelser} />
      ) : (
        <BodyShort>Ingen tidligere brudd registrert</BodyShort>
      )}
    </section>
  );
};
