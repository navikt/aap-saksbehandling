import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Alert, Loader, Pagination } from '@navikt/ds-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import styles from './PdfVisning.module.css';
import { BrevData } from 'components/brevbygger/Brevbygger';

const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry.js');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface Props {
  tittel: string;
  brevdata: BrevData[];
}

export const PdfVisning = ({ tittel, brevdata }: Props) => {
  const [pdfFilInnhold, setPfdFilInnhold] = useState<string>();
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    async function hentPdf() {
      const postData = {
        tittel,
        mottaker: {
          navn: 'Ola Nordmann',
          ident: '12345678910',
        },
        saksnummer: 'AABBCC123',
        dato: '11. august 2023',
        underblokker: brevdata.map((brev) => ({
          overskrift: brev.overskrift,
          nivå: brev.nivå,
          content: brev.content?.content,
        })),
      };

      console.log('postData', postData);

      const response = await fetch(`/api/pdf-preview/vedtaksbrev/fritekst`, {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      const pdfBuffer = await response.arrayBuffer();
      const pdfBlob = new Blob([new Uint8Array(pdfBuffer, 0)], { type: 'application/pdf' });

      const base64String: string = await new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(pdfBlob);
      });

      setPfdFilInnhold(base64String?.slice(base64String?.indexOf(',') + 1));
    }

    const timeOut = setTimeout(async () => {
      await hentPdf();
    }, 2000);

    return () => clearTimeout(timeOut);
  }, [brevdata, tittel]);

  if (!pdfFilInnhold) {
    return null;
  }

  return (
    <div className={styles.pdfPreview}>
      <Pagination page={pageNumber} count={numPages} onPageChange={setPageNumber} size="xsmall" />
      <Document
        file={`data:application/pdf;base64,${pdfFilInnhold}`}
        onLoadSuccess={(document) => setNumPages(document.numPages)}
        error={<Alert variant={'error'}>{'Ukjent feil ved henting av dokument.'} </Alert>}
        noData={<Alert variant={'error'}>{'Dokumentet er tomt'} </Alert>}
        loading={<Loader size={'xlarge'} variant="interaction" transparent={true} />}
      >
        <Page pageNumber={pageNumber} renderTextLayer={true} className={styles.pdfPage} />
      </Document>
      <Pagination page={pageNumber} count={numPages} onPageChange={setPageNumber} size="xsmall" />
    </div>
  );
};
