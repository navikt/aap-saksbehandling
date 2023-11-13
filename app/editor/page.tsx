'use client';

import styles from './page.module.css';
import { BrevEditor } from 'components/breveditor/BrevEditor';
import { Descendant } from 'slate';
import PdfVisning from './PdfVisning';
import { useState } from 'react';
import { Button } from '@navikt/ds-react';

const Page = () => {
  const [pdfString, setPdfString] = useState('');

  async function hentPdfOgRerender(data: Descendant[]) {
    const postData = {
      mottaker: {
        navn: 'Ola Nordmann',
        ident: '12345678910',
      },
      saksnummer: 'AABBCC123',
      dato: '11. august 2023',
      underblokker: data,
    };
    const pdf = await fetch('/api/pdf-preview/vedtak', { method: 'POST', body: JSON.stringify(postData) }).then((r) => {
      return r.arrayBuffer();
    });
    const pdfBlob = new Blob([new Uint8Array(pdf, 0)], { type: 'application/pdf' });
    let reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String: string = reader.result;
        setPdfString(base64String?.slice(base64String?.indexOf(',') + 1));
      }
    };
  }

  const [text, setText] = useState<Descendant[]>([]);
  return (
    <div className={styles.pageContainer}>
      <div style={{ padding: '3rem' }}>
        <BrevEditor setText={setText} />
        <Button onClick={() => hentPdfOgRerender(text)}>Forhåndsvis brev</Button>
      </div>
      <div className={styles.pdfPreview} id={'pdf-preview'}>
        {pdfString && <PdfVisning pdfFilInnhold={pdfString} />}
      </div>
    </div>
  );
};

export default Page;
