import { useEffect, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useDebounce } from 'hooks/DebounceHook';
import { clientOppdaterBrevdata } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { BrevdataDto } from 'lib/types/types';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { byggBrevdataPayload } from 'components/brevbygger/formUtils';

interface Props {
  referanse: string;
  control: Control<BrevFormVerdier>;
  brevmal: BrevmalType | null;
  brevdata: BrevdataDto | undefined;
}

interface MellomlagringAvBrevResultat {
  lasterHtml: boolean;
  brevPreview: BrevpreviewResponse | undefined;
}

export interface InnholdNode {
  htmlString: string;
  sanityNoekkel?: string;
}

export interface BrevpreviewResponse {
  header: InnholdNode;
  delmaler: InnholdNode[];
  signaturer: InnholdNode;
}

export function useMellomlagringAvBrev({ referanse, control, brevmal, brevdata }: Props): MellomlagringAvBrevResultat {
  const [lasterHtml, setLasterHtml] = useState(false);
  const [brevPreview, setBrevPreview] = useState<BrevpreviewResponse | undefined>();

  const formVerdier = useWatch({ control });
  const debouncedFormVerdier = useDebounce(formVerdier);

  useEffect(() => {
    const lagreOgOppdaterHtml = async () => {
      if (!brevmal) return;
      setLasterHtml(true);
      try {
        const payload = byggBrevdataPayload(debouncedFormVerdier as BrevFormVerdier, brevmal, brevdata);
        const res = await clientOppdaterBrevdata(referanse, payload);

        if (isSuccess(res)) {
          const response = await fetch(`/saksbehandling/api/brev/${referanse}/brevbygger-preview/`).then((r) =>
            r.json()
          );
          // .json er feltnavnet responsen, som er en json-string, ligger i.
          // Kommer fra endepunktet i behandlingsflyt og bør nok endres til noe som gir litt mer mening der
          setBrevPreview(JSON.parse(response.json));
        }
      } finally {
        setLasterHtml(false);
      }
    };
    lagreOgOppdaterHtml();
  }, [debouncedFormVerdier, referanse, brevmal, brevdata]);

  return { lasterHtml, brevPreview };
}
