'use client';

import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';
import {
  Hjemmel,
  KlagebehandlingKontorGrunnlag,
  KlagebehandlingNayGrunnlag,
  KlageInnstilling,
  TypeBehandling,
} from 'lib/types/types';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { hjemmelalternativer } from 'lib/utils/hjemmel';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlagNay: KlagebehandlingNayGrunnlag;
  grunnlagKontor: KlagebehandlingKontorGrunnlag;
}

interface FormFields {
  innstilling: KlageInnstilling;
  vilkårSomSkalOmgjøres: Hjemmel[];
  vilkårSomSkalOpprettholdes: Hjemmel[];
}

const utledInnstilling = (
  grunnlagNay: KlagebehandlingNayGrunnlag,
  grunnlagKontor: KlagebehandlingKontorGrunnlag
): 'OPPRETTHOLD' | 'OMGJØR' | 'DELVIS_OMGJØR' | undefined => {
  const innstillingKontor = grunnlagKontor.vurdering?.innstilling;
  const innstillingNay = grunnlagNay.vurdering?.innstilling;

  if (!innstillingNay || !innstillingKontor) {
    return undefined;
  } else if (innstillingNay === 'OMGJØR' && innstillingKontor === 'OMGJØR') {
    return 'OMGJØR';
  } else if (innstillingKontor === 'OPPRETTHOLD' && innstillingNay === 'OPPRETTHOLD') {
    return 'OPPRETTHOLD';
  } else {
    return 'DELVIS_OMGJØR';
  }
};

const utledVilkårSomOpprettholdes = (
  grunnlagKontor: KlagebehandlingKontorGrunnlag,
  grunnlagNay: KlagebehandlingNayGrunnlag
) => {
  const kontorVilkårOpprettholdes = grunnlagKontor.vurdering?.vilkårSomOpprettholdes || [];
  const nayVilkårOppretteholdes = grunnlagNay.vurdering?.vilkårSomOpprettholdes || [];
  return [...kontorVilkårOpprettholdes, ...nayVilkårOppretteholdes];
};

const utledVilkårSomOmgjøres = (
  grunnlagKontor: KlagebehandlingKontorGrunnlag,
  grunnlagNay: KlagebehandlingNayGrunnlag
) => {
  const kontorVilkårOmgjøres = grunnlagKontor.vurdering?.vilkårSomOmgjøres || [];
  const nayVilkårOmgjøres = grunnlagNay.vurdering?.vilkårSomOmgjøres || [];
  return [...kontorVilkårOmgjøres, ...nayVilkårOmgjøres];
};

export const KlagebehandlingOppsummering = ({
  erAktivtSteg,
  behandlingVersjon,
  readOnly,
  grunnlagNay,
  grunnlagKontor,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KLAGEBEHANDLING_OPPSUMMERING');

  const utledetInnstilling = utledInnstilling(grunnlagNay, grunnlagKontor);
  const vilkårSomOmgjøres = utledVilkårSomOmgjøres(grunnlagKontor, grunnlagNay);
  const vilkårSomOpprettholdes = utledVilkårSomOpprettholdes(grunnlagKontor, grunnlagNay);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      innstilling: {
        type: 'radio',
        label: 'Hva er innstillingen til klagen fra NAY og Nav-kontor?',
        options: [
          { value: 'OPPRETTHOLD', label: 'Vedtak opprettholdes' },
          {
            value: 'OMGJØR',
            label: 'Vedtak omgjøres',
          },
          { value: 'DELVIS_OMGJØR', label: 'Delvis omgjøring' },
        ],
      },
      vilkårSomSkalOmgjøres: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal omgjøres?',
        description: 'Alle påklagde vilkår som skal omgjøres som følge av klagen',
        options: hjemmelalternativer,
      },
      vilkårSomSkalOpprettholdes: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår er blitt vurdert til å opprettholdes?',
        description: 'Alle påklagde vilkår som blir opprettholdt',
        options: hjemmelalternativer,
      },
    },
    { readOnly: true }
  );

  if (utledetInnstilling) {
    form.setValue('innstilling', utledetInnstilling);
  }
  form.setValue('vilkårSomSkalOmgjøres', vilkårSomOmgjøres);
  form.setValue('vilkårSomSkalOpprettholdes', vilkårSomOpprettholdes);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(() => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.KLAGE_OPPSUMMERING,
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };
  return (
    <VilkårsKortMedForm
      heading={'Oppsummering klagebehandlingen'}
      steg={'KLAGEBEHANDLING_OPPSUMMERING'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      erAktivtSteg={erAktivtSteg}
      knappTekst={'Bekreft og send til beslutter'}
    >
      <FormField form={form} formField={formFields.innstilling} />
      {vilkårSomOmgjøres.length > 0 && <FormField form={form} formField={formFields.vilkårSomSkalOmgjøres} />}
      {vilkårSomOpprettholdes.length > 0 && <FormField form={form} formField={formFields.vilkårSomSkalOpprettholdes} />}
    </VilkårsKortMedForm>
  );
};
