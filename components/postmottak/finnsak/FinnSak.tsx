'use client';

import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { Behovstype } from 'lib/postmottakForm';
import { FormEvent, FormEventHandler } from 'react';
import { usePostmottakLøsBehovOgGåTilNesteSteg } from 'hooks/postmottak/PostmottakLøsBehovOgGåTilNesteStegHook';
import { FinnSakGrunnlag, Saksinfo } from 'lib/types/postmottakTypes';
import { Button, VStack } from '@navikt/ds-react';
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
  const nySakOption = grunnlag.saksinfo.length === 0 ? [{ label: 'Opprett ny sak', value: NY }] : [];

  //TODO Legg på description i radio valg
  // Dato for sak skal være i description.
  const { formFields, form } = useConfigForm<FormFields>(
    {
      knyttTilSak: {
        type: 'radio',
        label: 'Hvor skal dokumentet jorunalføres?',
        rules: { required: 'Du må svare på hvilken sak dokumentet skal knyttes til' },
        defaultValue: mapVurderingTilValgtOption(grunnlag.vurdering),
        options: [
          ...nySakOption,
          ...grunnlag.saksinfo.map(mapSaksinfoToValuePair),
          { label: 'Journalfør på generell sak', value: GENERELL },
        ],
      },
    },
    { readOnly }
  );

  const { løsBehovOgGåTilNesteSteg, status, isLoading } = usePostmottakLøsBehovOgGåTilNesteSteg('AVKLAR_SAK');
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
    <VilkårsKort heading={'Avklar sak'}>
      <form onSubmit={onSubmit}>
        <VStack gap={'6'}>
          <ServerSentEventStatusAlert status={status} />
          <FormField form={form} formField={formFields.knyttTilSak} />
          <Button loading={isLoading} className={'fit-content'}>
            Send inn
          </Button>
        </VStack>
      </form>
    </VilkårsKort>
  );
};

function mapSaksinfoToValuePair(saksinfo: Saksinfo): ValuePair {
  return {
    value: saksinfo.saksnummer,
    label: `${saksinfo.saksnummer}: ${saksinfo.periode.fom} - ${saksinfo.periode.tom}`,
  };
}
