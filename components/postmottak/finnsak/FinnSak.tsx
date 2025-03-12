'use client';

import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { Behovstype } from 'lib/postmottakForm';
import { FormEvent, FormEventHandler } from 'react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/LøsBehovOgGåTilNesteStegHook';
import { FinnSakGrunnlag, Saksinfo } from 'lib/types/postmottakTypes';
import { Nesteknapp } from 'components/postmottak/nesteknapp/Nesteknapp';
import { VStack } from '@navikt/ds-react';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';

interface Props {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  grunnlag: FinnSakGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  knyttTilSak: string;
}

const GENERELL = 'GENERELL';
const NY = 'NY';

function mapVurderingTilValgtOption(vurdering: FinnSakGrunnlag['vurdering']) {
  if (vurdering?.førPåGenerellSak) {
    return GENERELL;
  } else if (vurdering?.saksnummer) {
    return vurdering.saksnummer;
  } else {
    return undefined;
  }
}

export const FinnSak = ({ behandlingsVersjon, behandlingsreferanse, grunnlag, readOnly }: Props) => {
  const nySakOption = grunnlag.saksinfo.length === 0 ? [{ label: 'Ny sak', value: NY }] : [];
  const { formFields, form } = useConfigForm<FormFields>(
    {
      knyttTilSak: {
        type: 'radio',
        label: 'Journalfør dokumentet på sak',
        rules: { required: 'Du må svare på hvilken sak dokumentet skal knyttes til' },
        defaultValue: mapVurderingTilValgtOption(grunnlag.vurdering),
        options: [
          ...nySakOption,
          ...grunnlag.saksinfo.map(mapSaksinfoToValuePair),
          { label: 'Generell Sak', value: GENERELL },
        ],
      },
    },
    { readOnly }
  );
  const { løsBehovOgGåTilNesteSteg, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SAK');
  const onSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingsVersjon,
        behov: {
          behovstype: Behovstype.FINN_SAK,
          opprettNySak: data.knyttTilSak === NY,
          førPåGenerellSak: data.knyttTilSak === GENERELL,
          saksnummer: data.knyttTilSak === NY || data.knyttTilSak === GENERELL ? null : data.knyttTilSak,
        },
        // @ts-ignore
        referanse: behandlingsreferanse,
      });
    })(event);
  };
  return (
    <VStack padding={'4'} gap={'4'}>
      <VilkårsKort heading={'Avklar sak'}>
        <form onSubmit={onSubmit}>
          <VStack gap={'6'}>
            <ServerSentEventStatusAlert status={status} />
            <FormField form={form} formField={formFields.knyttTilSak} />
            <Nesteknapp disabled={readOnly}>Send inn</Nesteknapp>
          </VStack>
        </form>
      </VilkårsKort>
    </VStack>
  );
};

function mapSaksinfoToValuePair(saksinfo: Saksinfo): ValuePair {
  return {
    value: saksinfo.saksnummer,
    label: `${saksinfo.saksnummer}: ${saksinfo.periode.fom} - ${saksinfo.periode.tom}`,
  };
}
