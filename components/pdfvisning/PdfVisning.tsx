import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader, Pagination, Alert } from '@navikt/ds-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry.js');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfVisningProps {
  pdfFilInnhold: unknown;
}

export const PdfVisning = ({ pdfFilInnhold }: PdfVisningProps) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    if (pageNumber > numPages) {
      setPageNumber(numPages);
    }
    setNumPages(numPages);
  }

  return (
    <div>
      <Pagination page={pageNumber} count={numPages} onPageChange={setPageNumber} size="xsmall" />
      <Document
        file={`data:application/pdf;base64,${pdfFilInnhold}`}
        onLoadSuccess={onDocumentLoadSuccess}
        error={<Alert variant={'error'}>{'Ukjent feil ved henting av dokument.'} </Alert>}
        noData={<Alert variant={'error'}>{'Dokumentet er tomt'} </Alert>}
        loading={<Loader size={'xlarge'} variant="interaction" transparent={true} />}
      >
        <Page pageNumber={pageNumber} renderTextLayer={true} />
      </Document>
      <Pagination page={pageNumber} count={numPages} onPageChange={setPageNumber} size="xsmall" />
    </div>
  );
};
