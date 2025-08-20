'use client';

import { useConfigForm } from 'components/form/FormHook';
import { isBefore, parse, startOfDay } from 'date-fns';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerNullableDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { Button, Radio } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useFieldArray } from 'react-hook-form';
import { RadioGroupWrapper } from '../../../form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from '../../../form/dateinputwrapper/DateInputWrapper';
import { isError } from 'lib/utils/api';
import { ValuePair } from '../../../form/FormField';
import { AsyncComboSearch } from '../../../form/asynccombosearch/AsyncComboSearch';
import { isLocal } from 'lib/utils/environment';
import { Enhet } from 'lib/types/oppgaveTypes';
import { clientHentAlleNavenheter } from 'lib/clientApi';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: RefusjonskravGrunnlag;
}

interface FormFields {
  harKrav: string;
  refusjoner: Refusjon[];
}

interface Refusjon {
  fom?: string;
  navKontor: NavKontor;
  tom?: string;
}

interface NavKontor {
  label?: string;
  value?: string;
}

export const Refusjon = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('REFUSJON_KRAV');

  const { sak } = useSak();
  const behandlingsreferanse = useBehandlingsReferanse();

  const defaultRefusjonValue: Refusjon[] =
    Array.isArray(grunnlag.gjeldendeVurderinger) && grunnlag.gjeldendeVurderinger.length > 0
      ? grunnlag.gjeldendeVurderinger.map((vurdering) => ({
          navKontor: {
            label: vurdering.navKontor ?? '',
            value: vurdering.navKontor ?? '',
          },
          fom: formaterDatoForFrontend(vurdering.fom ?? sak.periode.fom),
          tom: formaterDatoForFrontend(vurdering.tom ?? sak.periode.tom),
        }))
      : [
          {
            navKontor: {
              label: '',
              value: '',
            },
            fom: formaterDatoForFrontend(sak.periode.fom),
            tom: formaterDatoForFrontend(sak.periode.tom),
          },
        ];

  const defaultOptions: ValuePair[] = (grunnlag.gjeldendeVurderinger ?? []).map((vurdering) => ({
    label: vurdering.navKontor ?? '',
    value: vurdering.navKontor ?? '',
  }));

  const { form } = useConfigForm<FormFields>({
    harKrav: {
      type: 'radio',
      label: 'Har noen Nav-kontor refusjonskrav for sosialstønad?',
      defaultValue: getJaNeiEllerUndefined(grunnlag.gjeldendeVurdering?.harKrav),
      rules: { required: 'Du må svare på om Nav-kontoret har refusjonskrav' },
      options: JaEllerNeiOptions,
    },
    refusjoner: {
      type: 'fieldArray',
      defaultValue: defaultRefusjonValue,
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behov: {
          behovstype: Behovstype.REFUSJON_KRAV_KODE,
          refusjonkravVurderinger: data.refusjoner.map((refusjon) => ({
            harKrav: data.harKrav === JaEllerNei.Ja,
            navKontor: refusjon.navKontor.value,
            fom: refusjon.fom ? formaterDatoForBackend(parse(refusjon.fom, 'dd.MM.yyyy', new Date())) : null,
            tom: refusjon.tom ? formaterDatoForBackend(parse(refusjon.tom, 'dd.MM.yyyy', new Date())) : null,
          })),
        },
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  const testdata: Enhet[] = [
    {
      navn: 'Nav Løten',
      enhetNr: '0415',
    },
    {
      navn: 'Nav Asker',
      enhetNr: '0220',
    },
    {
      navn: 'Nav Grorud',
      enhetNr: '0328',
    },
  ];

  const kontorSøk = async (input: string) => {
    if (isLocal()) {
      const res: ValuePair[] = testdata.map((kontor) => ({
        label: `${kontor.navn} - ${kontor.enhetNr}`,
        value: `${kontor.navn} - ${kontor.enhetNr}`,
      }));

      return res;
    }

    if (input.length <= 2) {
      return [];
    }
    const response = await clientHentAlleNavenheter(behandlingsreferanse, { navn: input });
    if (isError(response)) {
      return [];
    }

    const res = response.data.map((kontor) => ({
      label: `${kontor.navn} - ${kontor.enhetsnummer}`,
      value: `${kontor.navn} - ${kontor.enhetsnummer}`,
    }));
    return res;
  };

  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'refusjoner' });

  return (
    <VilkårsKortMedForm
      heading={'Sosialstønad refusjonskrav'}
      steg="REFUSJON_KRAV"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag.gjeldendeVurderinger?.[0]?.vurdertAv}
    >
      <RadioGroupWrapper
        name={`harKrav`}
        control={form.control}
        label={'Er det refusjonskrav fra Nav-kontor?'}
        rules={{ required: 'Du må velge om brukeren har refusjonskrav' }}
        readOnly={readOnly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>

      {form.watch('harKrav') === JaEllerNei.Ja &&
        fields.map((field, index) => {
          const erFørsterefusjon = index === 0;
          return (
            <div key={field.id} style={{ display: 'flex', gap: '1.0rem', flexDirection: 'row', flexWrap: 'wrap' }}>
              <DateInputWrapper
                name={`refusjoner.${index}.fom`}
                control={form.control}
                label={'Refusjonen gjelder fra'}
                rules={{
                  validate: {
                    gyldigDato: (value) => validerNullableDato(value as string),
                    kanIkkeVaereFoerSoeknadstidspunkt: (value) => {
                      const starttidspunkt = startOfDay(new Date(sak.periode.fom));
                      const vurderingGjelderFra = stringToDate(value as string, 'dd.MM.yyyy');
                      if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), starttidspunkt)) {
                        return 'Vurderingen kan ikke gjelde fra før starttidspunktet';
                      }
                      return true;
                    },
                  },
                }}
                readOnly={readOnly}
              />
              <DateInputWrapper
                name={`refusjoner.${index}.tom`}
                control={form.control}
                label={'Refusjonen gjelder til'}
                rules={{
                  validate: {
                    gyldigDato: (value) => validerNullableDato(value as string),
                    kanIkkeVaereFoerFraDato: (value) => {
                      const fomValue = form.getValues(`refusjoner.${index}.fom`);
                      if (!fomValue) {
                        return true;
                      }
                      const fomDate = startOfDay(parse(fomValue, 'dd.MM.yyyy', new Date()));
                      const vurderingGjelderTil = stringToDate(value as string, 'dd.MM.yyyy');
                      if (vurderingGjelderTil && isBefore(startOfDay(vurderingGjelderTil), fomDate)) {
                        return 'Tildato kan ikke være før fradato';
                      }
                      return true;
                    },
                  },
                }}
                readOnly={readOnly}
              />
              <AsyncComboSearch
                label={'Søk opp Nav-kontor'}
                form={form}
                name={`refusjoner.${index}.navKontor`}
                fetcher={kontorSøk}
                rules={{
                  validate: {
                    valgtKontor: (value) => {
                      if (!value) return 'Du må velge et Nav-kontor';
                      if (typeof value === 'object' && 'value' in value) {
                        return value.value?.trim() ? true : 'Du må velge et Nav-kontor';
                      }
                    },
                  },
                }}
                size={'small'}
                defaultOptions={defaultOptions}
                readOnly={readOnly}
              />
              {!erFørsterefusjon && !readOnly && (
                <Button
                  type={'button'}
                  icon={<TrashIcon aria-hidden />}
                  className={'fit-content'}
                  variant={'tertiary'}
                  size={'small'}
                  onClick={() => remove(index)}
                >
                  Fjern Nav-kontor
                </Button>
              )}
            </div>
          );
        })}
      {form.watch('harKrav') === JaEllerNei.Ja && !readOnly && (
        <Button
          type={'button'}
          className={'fit-content'}
          variant={'secondary'}
          size={'small'}
          onClick={() => append({ navKontor: { label: '', value: '' }, fom: '', tom: '' })}
        >
          Legg til nytt Nav-kontor
        </Button>
      )}
    </VilkårsKortMedForm>
  );
};
