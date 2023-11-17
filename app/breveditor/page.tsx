'use client';

import { Breveditor } from 'components/breveditor/Breveditor';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { usePdfGenerator } from 'components/pdfvisning/usePdfGenerator';
import { ReactNode, useState } from 'react';

type StackTypeProps = {
  stack: typeof HStack | typeof VStack;
  children: ReactNode;
  className?: string;
};
const Stack = ({ stack, children, className }: StackTypeProps) => {
  const StackComponent = stack;
  return <StackComponent className={className}>{children}</StackComponent>;
};

const Page = () => {
  const { pdf, setBrevData } = usePdfGenerator('fritekst');
  const [visPdf, setVisPdf] = useState<boolean>(false);

  return (
    <Stack stack={visPdf ? HStack : VStack}>
      <VStack>
        <Button variant={'primary'} onClick={() => setVisPdf(!visPdf)}>
          {visPdf ? 'Skjul pdf' : 'Vis pdf'}
        </Button>
        <Breveditor setContent={visPdf ? setBrevData : () => {}} />
      </VStack>

      {visPdf && pdf && <PdfVisning pdfFilInnhold={pdf} />}
    </Stack>
  );
};
export default Page;
