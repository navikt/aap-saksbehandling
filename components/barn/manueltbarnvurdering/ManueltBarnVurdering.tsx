import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { QuestionmarkDiamondIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { ManueltBarnVurderingFelter } from 'components/barn/manueltbarnvurderingfelter/ManueltBarnVurderingFelter';

import styles from './ManueltBarnVurdering.module.css';

interface Props {
  form: UseFormReturn<BarnetilleggFormFields>;
  barnetilleggIndex: number;
  ident: string;
  navn: string;
  readOnly: boolean;
}

export const ManueltBarnVurdering = ({ form, barnetilleggIndex, ident, navn, readOnly }: Props) => {
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
          <Heading size={'small'}>{ident}</Heading>
          <BodyShort size={'small'}>{navn}</BodyShort>
        </div>
      </div>
      <div>
        {vurderinger.map((vurdering, vurderingIndex) => (
          <div key={vurdering.id} className={styles.vurdering}>
            <ManueltBarnVurderingFelter
              form={form}
              readOnly={readOnly}
              ident={ident}
              barneTilleggIndex={barnetilleggIndex}
              vurderingIndex={vurderingIndex}
            />

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
          </div>
        ))}
      </div>

      <Button
        onClick={() => append({ begrunnelse: '', harForeldreAnsvar: '', fom: '' })}
        className={'fit-content-button'}
        variant={'secondary'}
        size={'small'}
        type={'button'}
      >
        Legg til flere perioder
      </Button>
    </section>
  );
};
