import { BodyShort, CopyButton, HStack, Label, Link } from '@navikt/ds-react';
import { SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';

interface Props {
  personInformasjon: SakPersoninfo;
  sak: SaksInfoType;
}

export const SaksInfo = ({ personInformasjon, sak }: Props) => (
  <HStack gap="4" align="center">
    <Label size="small">
      <Link href={`/saksbehandling/sak/${sak.saksnummer}`} title="Tilbake til K-Hub">
        {personInformasjon.navn}
      </Link>
    </Label>

    <BodyShort aria-hidden>|</BodyShort>

    <CopyButton copyText={sak?.ident} size="small" text={sak?.ident} iconPosition="left" />
  </HStack>
);
