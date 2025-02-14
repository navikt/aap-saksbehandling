import { BodyShort, Heading, VStack } from '@navikt/ds-react';

export default function ForbiddenPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBlockStart: '2rem',
      }}
    >
      <Heading level="2" size="medium" spacing>
        ❌ Oi! Her har du ikke tilgang gitt
      </Heading>
      <VStack align={'center'}>
        <BodyShort spacing>Du har ikke tilgang til å se dette.</BodyShort>
        <BodyShort spacing>Gå til oppgavelisten for å se oppgaver du har tilgang til.</BodyShort>
      </VStack>
    </div>
  );
}
