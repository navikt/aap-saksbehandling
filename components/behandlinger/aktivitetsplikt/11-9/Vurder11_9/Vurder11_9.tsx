'use client';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { FormEvent } from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import { Registrer11_9BruddTabell } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { useFieldArray } from 'react-hook-form';
import { useConfigForm } from 'components/form/FormHook';
import { Vurder11_9Grunnlag } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { Vurdering11_9Skjema } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurdering11_9Skjerma';

type Props = {
  grunnlag?: Vurder11_9Grunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
};

export type Vurdering11_9FormFields = {
  vurderinger: {
    begrunnelse: string;
    dato: string;
    brudd: string;
    grunn: string;
  }[];
};

export const Vurder11_9 = ({ readOnly, grunnlag }: Props) => {
  const tidligereVurderinger = grunnlag?.tidligereVurderinger || [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    console.log(event);
  };

  const { form } = useConfigForm<Vurdering11_9FormFields>({
    vurderinger: {
      type: 'fieldArray',
      defaultValue:
        grunnlag?.tidligereVurderinger?.map((v) => ({
          begrunnelse: v.begrunnelse,
          dato: v.dato,
          brudd: v.brudd,
          grunn: v.grunn,
        })) ?? [],
    },
  });

  const finnDefaultVerdierForVurdering = (dato: string) => {
    const vurdering = tidligereVurderinger.find((v) => v.dato === dato);
    return {
      begrunnelse: vurdering?.begrunnelse || '',
      dato: vurdering?.dato || dato,
      brudd: vurdering?.brudd || '',
      grunn: vurdering?.grunn || '',
    };
  };

  const { fields: vurderinger, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });

  const handleChange = (checked: boolean, dato: string) => {
    if (checked) {
      append(finnDefaultVerdierForVurdering(dato));
      return;
    } else {
      const eksisterendeIndex = vurderinger.findIndex((v) => v.dato === dato);
      remove(eksisterendeIndex);
    }
  };

  const valgteRader = vurderinger.map((v) => v.dato).sort((a, b) => a.localeCompare(b));

  return (
    <VilkårskortMedForm
      heading={'§ 11-9 Reduksjon av AAP etter brudd på aktivitetsplikt'}
      steg={'VURDER_AKTIVITETSPLIKT_11_9'}
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      knappTekst={'Bekreft og send til beslutter'}
      isLoading={false}
      status={'DONE'}
    >
      <VStack gap={'4'}>
        <Heading level={'3'} size={'xsmall'}>
          Tidligere brudd på aktivitetsplikten § 11-9
        </Heading>
        <VStack gap={'10'}>
          <Registrer11_9BruddTabell
            tidligereVurderinger={tidligereVurderinger}
            valgteRader={valgteRader}
            onClickRad={handleChange}
            readOnly={readOnly}
          ></Registrer11_9BruddTabell>
          {valgteRader.map((dato) => (
            <Vurdering11_9Skjema
              key={dato}
              control={form.control}
              index={vurderinger.findIndex((field) => field.dato === dato)}
              field={vurderinger.find((field) => field.dato === dato)!}
              readOnly={readOnly}
            />
          ))}
        </VStack>
      </VStack>
    </VilkårskortMedForm>
  );
};
