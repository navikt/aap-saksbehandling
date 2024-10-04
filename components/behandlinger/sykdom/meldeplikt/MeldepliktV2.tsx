//@ts-nocheck
'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { FigureIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { parse } from 'date-fns';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';

type Props = {
  behandlingVersjon: number;
  grunnlag?: FritakMeldepliktGrunnlag;
  readOnly: boolean;
};

type FritakMeldepliktFormFields = {
  begrunnelse: string;
  harFritak: JaEllerNei;
  fraDato: string;
};

export const MeldepliktV2 = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const sisteVurdering = grunnlag?.vurderinger.at(-1);
  const { form, formFields } = useConfigForm<FritakMeldepliktFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder innbyggers behov for fritak fra meldeplikt',
        rules: { required: 'Du må begrunne vurderingen din' },
        defaultValue: sisteVurdering?.begrunnelse,
      },
      harFritak: {
        type: 'radio',
        label: 'Skal innbygger få fritak fra meldeplikt?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(sisteVurdering?.harFritak),
        rules: { required: 'Du må svare på om innbygger skal få fritak fra meldeplikt' },
      },
      fraDato: {
        type: 'text',
        label: 'Vurderingen gjelder fra',
        description: 'Datoformat: dd.mm.åååå',
        defaultValue: sisteVurdering?.fraDato ? formaterDatoForVisning(sisteVurdering.fraDato) : undefined,
        rules: {
          required: 'Du må angi en dato vurderingen gjelder fra',
          validate: (value) => validerDato(value as string),
        },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');
  const behandlingsreferanse = useBehandlingsReferanse();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
          fritaksvurdering: {
            begrunnelse: data.begrunnelse,
            harFritak: data.harFritak === JaEllerNei.Ja,
            fraDato: formaterDatoForBackend(parse(data.fraDato, 'dd.MM.yyyy', new Date())),
          },
        },
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading={'Unntak fra meldeplikt § 11-10 (valgfritt)'}
      steg="FRITAK_MELDEPLIKT"
      icon={<FigureIcon fontSize={'inherit'} />}
      vilkårTilhørerNavKontor
      defaultOpen={false}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'FRITAK_MELDEPLIKT'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.harFritak} />
        <FormField form={form} formField={formFields.fraDato} />
      </Form>
    </VilkårsKort>
  );
};
