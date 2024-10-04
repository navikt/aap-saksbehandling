import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { PlusCircleIcon, QuestionmarkDiamondIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { OppgitteBarnVurderingFelter } from 'components/barn/oppgittebarnvurderingfelter/OppgitteBarnVurderingFelter';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';

import styles from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering.module.css';

interface Props {
  form: UseFormReturn<BarnetilleggFormFields>;
  barnetilleggIndex: number;
  ident: string;
  navn: string;
  fødselsdato: string;
  readOnly: boolean;
}

export const OppgitteBarnVurdering = ({ form, barnetilleggIndex, ident, navn, readOnly, fødselsdato }: Props) => {
  const {
    fields: vurderinger,
    remove,
    append,
  } = useFieldArray({
    control: form.control,
    name: `barnetilleggVurderinger.${barnetilleggIndex}.vurderinger`,
  });

  return (
    <section className={`${styles.barnekort} flex-column`}>
      <div className={styles.manueltbarnheading}>
        <div>
          <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'3rem'} />
        </div>
        <div>
          <Heading size={'small'}>Oppgitt fosterbarn - {ident}</Heading>
          <BodyShort size={'medium'}>
            {navn} ({kalkulerAlder(new Date(fødselsdato))})
          </BodyShort>
        </div>
      </div>
      <div>
        {vurderinger.map((vurdering, vurderingIndex) => {
          const kanFjernePeriode = vurderingIndex !== 0;
          return (
            <div key={vurdering.id} className={styles.vurdering}>
              <OppgitteBarnVurderingFelter
                form={form}
                readOnly={readOnly}
                ident={ident}
                barneTilleggIndex={barnetilleggIndex}
                vurderingIndex={vurderingIndex}
              />
              {kanFjernePeriode && (
                <Button
                  onClick={() => remove(vurderingIndex)}
                  className={'fit-content-button'}
                  type={'button'}
                  size={'small'}
                  variant={'tertiary'}
                  icon={<TrashIcon />}
                >
                  Fjern periode
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <Button
        onClick={() => append({ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' })}
        className={'fit-content-button'}
        variant={'tertiary'}
        size={'medium'}
        icon={<PlusCircleIcon />}
        type={'button'}
      >
        Legg til periode
      </Button>
    </section>
  );
};
