'use client';

import { Heading } from '@navikt/ds-react';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';

//404 Page
const notFound = () => {
  return (
    <Layout>
      <Section>
        <Heading level="2" size="medium" spacing>
          Denne siden finnes ikke.
        </Heading>
      </Section>
    </Layout>
  );
};

export default notFound;
