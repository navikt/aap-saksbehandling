'use client';

import { TextAreaWrapper, TextFieldWrapper, useConfigForm } from '@navikt/aap-felles-react';
import { FigureIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, List, Radio, ReadMore } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useFieldArray } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';

import styles from './Meldeplikt.module.css';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

type Props = {
  behandlingVersjon: number;
  grunnlag?: FritakMeldepliktGrunnlag;
  readOnly: boolean;
};

type Fritaksvurderinger = {
  begrunnelse: string;
  harFritak: string;
  fraDato: string;
  erReadOnly: boolean;
};

type FritakMeldepliktFormFields = {
  fritaksvurderinger: Fritaksvurderinger[];
};

export const Meldeplikt = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  let defaultValues: Fritaksvurderinger[] = grunnlag?.vurderinger.map((vurdering) => ({
    begrunnelse: vurdering.begrunnelse,
    fraDato: formaterDatoForFrontend(vurdering.fraDato),
    harFritak: vurdering.harFritak ? JaEllerNei.Ja : JaEllerNei.Nei,
    erReadOnly: true,
  })) || [{ begrunnelse: '', fraDato: '', harFritak: '', erReadOnly: false }];

  const { form } = useConfigForm<FritakMeldepliktFormFields>({
    fritaksvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValues,
    },
  });

  const {
    fields: fritakMeldepliktVurderinger,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'fritaksvurderinger',
  });

  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');
  const behandlingsreferanse = useBehandlingsReferanse();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
          fritaksvurderinger: data.fritaksvurderinger.map((periode) => ({
            begrunnelse: periode.begrunnelse,
            harFritak: periode.harFritak === JaEllerNei.Ja,
            fraDato: formaterDatoForBackend(parse(periode.fraDato, 'dd.MM.yyyy', new Date())),
          })),
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
      <ReadMore header={'Vilkåret skal kun vurderes ved behov. Se mer om vurdering av fritak fra meldeplikt'}>
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
      </ReadMore>

      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'FRITAK_MELDEPLIKT'}
        visBekreftKnapp={!readOnly}
      >
        {fritakMeldepliktVurderinger.map((vurdering, index) => (
          <div className={`${styles.vurdering} flex-column`} key={vurdering.id}>
            <TextAreaWrapper
              label={'Vurder innbyggers behov for fritak fra meldeplikt'}
              control={form.control}
              name={`fritaksvurderinger.${index}.begrunnelse`}
              rules={{ required: 'Du må begrunne vurderingen din' }}
              readOnly={readOnly || vurdering.erReadOnly}
            />
            <RadioGroupWrapper
              label={'Skal innbygger få fritak fra meldeplikt?'}
              control={form.control}
              name={`fritaksvurderinger.${index}.harFritak`}
              rules={{ required: 'Du må svare på om innbygger skal få fritak fra meldeplikt' }}
              readOnly={readOnly || vurdering.erReadOnly}
            >
              <Radio value={JaEllerNei.Ja}>Ja</Radio>
              <Radio value={JaEllerNei.Nei}>Nei</Radio>
            </RadioGroupWrapper>
            <TextFieldWrapper
              label={'Vurderingen gjelder fra'}
              description={'Datoformat: dd.mm.åååå'}
              control={form.control}
              name={`fritaksvurderinger.${index}.fraDato`}
              type={'text'}
              rules={{
                required: 'Du må angi en dato vurderingen gjelder fra',
                validate: (value) => validerDato(value as string),
              }}
              readOnly={readOnly || vurdering.erReadOnly}
            />
            {!readOnly && !vurdering.erReadOnly && fritakMeldepliktVurderinger.length > 1 && (
              <div>
                <Button onClick={() => remove(index)} type={'button'} variant={'tertiary'} icon={<TrashIcon />}>
                  Fjern periode
                </Button>
              </div>
            )}
          </div>
        ))}
        {!readOnly && (
          <div>
            <Button
              onClick={() => append({ begrunnelse: '', harFritak: '', fraDato: '', erReadOnly: false })}
              type={'button'}
              variant={'tertiary'}
              size={'medium'}
              icon={<PlusCircleIcon />}
            >
              Legg til periode
            </Button>
          </div>
        )}
      </Form>
    </VilkårsKort>
  );
};
