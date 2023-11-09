'use client';

import { BrevEditor } from 'components/breveditor/BrevEditor';

const Page = async () => {
  async function hentPdfForhåndsvisning() {
    const pdf = await fetch('/api/pdf-preview/vedtak', { method: 'POST', body: 'hei' }).then((r) => {
      return r.arrayBuffer();
    });
    const pdfBlob = new Blob([new Uint8Array(pdf, 0)], { type: 'application/pdf' });
    const pdfViewer = document.createElement('iframe');

    pdfViewer.src = URL.createObjectURL(pdfBlob);
    pdfViewer.onload = () => URL.revokeObjectURL(pdfViewer.src);

    // Styling related to demo
    pdfViewer.style.height = '100vh';
    pdfViewer.style.width = '100vw';
    pdfViewer.style.border = '0';
    pdfViewer.style.borderRadius = '6px';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    document.body.appendChild(pdfViewer);
  }
  return (
    <div>
      <div style={{ padding: '3rem' }}>
        <BrevEditor />
      </div>
      <button onClick={() => hentPdfForhåndsvisning()}>Hent brev</button>
    </div>
  );
};

export default Page;
