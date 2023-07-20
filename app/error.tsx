'use client';

import { Heading } from '@navikt/ds-react';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';

//500 Page
const Error = () => {
  return (
    <Layout>
      <Section>
        <Heading level="2" size="medium" spacing>
          Det har oppstått en feil 🙃.
        </Heading>
      </Section>
    </Layout>
  );
};

export default Error;
