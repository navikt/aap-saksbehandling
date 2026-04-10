import { useEffect, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useDebounce } from 'hooks/DebounceHook';
import { clientOppdaterBrevdata } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { BrevdataDto } from 'lib/types/types';
import { BrevFormVerdier } from 'components/brevbygger/brevbyggerNy/types';
import { byggBrevdataPayload } from 'components/brevbygger/brevbyggerNy/formUtils';

interface Props {
  referanse: string;
  control: Control<BrevFormVerdier>;
  brevmal: BrevmalType;
  brevdata: BrevdataDto | undefined;
}

interface MellomlagringAvBrevResultat {
  pdfDataUri: string | undefined;
  lasterPdf: boolean;
}

export function useMellomlagringAvBrev({ referanse, control, brevmal, brevdata }: Props): MellomlagringAvBrevResultat {
  const [pdfDataUri, setPdfDataUri] = useState<string | undefined>();
  const [lasterPdf, setLasterPdf] = useState(false);

  useEffect(() => {
    return () => {
      if (pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    };
  });

  const formVerdier = useWatch({ control });
  const debouncedFormVerdier = useDebounce(formVerdier);

  useEffect(() => {
    const lagreOgOppdaterPdf = async () => {
      const payload = byggBrevdataPayload(debouncedFormVerdier as BrevFormVerdier, brevmal, brevdata);
      const res = await clientOppdaterBrevdata(referanse, payload);

      if (isSuccess(res)) {
        setLasterPdf(true);
        const blob = await fetch(`/saksbehandling/api/brev/${referanse}/forhandsvis/`).then((r) => r.blob());
        setPdfDataUri(URL.createObjectURL(new Blob([blob], { type: 'application/pdf' })));
        setLasterPdf(false);
      }
    };

    lagreOgOppdaterPdf();
  }, [debouncedFormVerdier]);

  return { pdfDataUri, lasterPdf };
}
