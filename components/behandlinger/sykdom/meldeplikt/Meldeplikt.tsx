'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { Alert, BodyShort, List } from '@navikt/ds-react';
import { FigureIcon } from '@navikt/aksel-icons';

import style from './Meldeplikt.module.css';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { Veiledning } from 'components/veiledning/Veiledning';
import { formaterDatoForBackend } from 'lib/utils/date';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: FritakMeldepliktGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  unntakFraMeldeplikt: string[];
  startDato?: Date;
  sluttDato?: Date;
}

export const Meldeplikt = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        description: 'Begrunn vurderingen',
        label: 'Vurder om det vil være unødig tyngende for søker å overholde meldeplikten',
        rules: { required: 'Du må begrunne' },
        defaultValue: grunnlag?.vurderinger?.[0]?.begrunnelse,
      },
      unntakFraMeldeplikt: {
        type: 'checkbox',
        label: 'Det vurderes at søker kan unntas fra meldeplikten',
        rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
        options: ['Unntak fra meldeplikten'],
      },
      startDato: {
        type: 'date',
        toDate: new Date(),
        label: 'Startdato for fritak fra meldeplikt',
      },
      sluttDato: {
        type: 'date',
        fromDate: new Date(),
        label: 'Sluttdato for fritak fra meldeplikt',
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
          fritaksvurdering: {
            begrunnelse: data.begrunnelse,
            harFritak: data.unntakFraMeldeplikt.includes('Unntak fra meldeplikten'),
            periode: {
              fom: data.startDato ? formaterDatoForBackend(data.startDato) : '',
              tom: data.sluttDato ? formaterDatoForBackend(data.sluttDato) : '',
            },
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading={'Unntak fra meldeplikt § 11-10'}
      steg="FRITAK_MELDEPLIKT"
      icon={<FigureIcon fontSize={'inherit'} />}
      vilkårTilhørerNavKontor={true}
      defaultOpen={false}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'BARNETILLEGG'}
        visBekreftKnapp={!readOnly}
      >
        <Alert variant={'info'} size={'small'}>
          <BodyShort size={'small'}>Unntak fra meldeplikten skal kun vurderes dersom saksbehandler:</BodyShort>
          <List as={'ol'} size={'small'}>
            <List.Item>
              <BodyShort size={'small'}>
                Vurderer at det vil være unødig tyngende for søker å overholde meldeplikten
              </BodyShort>
            </List.Item>
            <List.Item>
              <BodyShort size={'small'}>
                Er usikker på om det vil være unødig tyngende for søker å overholde meldeplikten
              </BodyShort>
            </List.Item>
          </List>
        </Alert>

        <Veiledning />

        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.unntakFraMeldeplikt} />

        {form.watch('unntakFraMeldeplikt') && form.watch('unntakFraMeldeplikt').includes('Unntak fra meldeplikten') && (
          <div className={style.datofelter}>
            <FormField form={form} formField={formFields.startDato} />
            <FormField form={form} formField={formFields.sluttDato} />
          </div>
        )}
      </Form>
    </VilkårsKort>
  );
};
