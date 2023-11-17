import { useEffect, useMemo, useState } from 'react';
import { JSONContent } from '@tiptap/core';

export const usePdfGenerator = (pdfmal: string) => {
  const [pdfString, setPdfString] = useState('');
  const [oppdaterPdf, setOppdaterPdf] = useState<boolean>(true);
  const [brevData, setBrevData] = useState<JSONContent>({});

  useEffect(() => {
    const timeOut = setTimeout(async () => {
      await hentPdfOgRerender(brevData, oppdaterPdf);
    }, 2000);
    return () => clearTimeout(timeOut);
  }, [brevData]);
  function setBrevDataOgPdfOppdatering(data: JSONContent, oppdaterPdf: boolean) {
    setOppdaterPdf(oppdaterPdf);
    setBrevData(data);
  }

  async function hentPdfOgRerender(data: JSONContent, oppdaterPdf: boolean) {
    if (!oppdaterPdf) return;
    const postData = {
      mottaker: {
        navn: 'Ola Nordmann',
        ident: '12345678910',
      },
      saksnummer: 'AABBCC123',
      dato: '11. august 2023',
      underblokker: data.content,
    };
    const pdf = await fetch(`/api/pdf-preview/vedtaksbrev/${pdfmal}`, {
      method: 'POST',
      body: JSON.stringify(postData),
    }).then((r) => {
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
  return {
    pdf: useMemo<string>(() => pdfString, [pdfString]),
    setBrevData: setBrevDataOgPdfOppdatering,
    brevData,
  };
};
