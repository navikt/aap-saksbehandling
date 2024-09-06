'use client';

import { ChildHairEyesIcon, QuestionmarkDiamondIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, Button, CheckboxGroup, Heading, Label } from '@navikt/ds-react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { BarnetilleggGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useState } from 'react';
import styles from 'components/barn/Barn.module.css';
import { ManueltBarn } from 'components/barn/manueltbarn/ManueltBarn';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';

import { v4 as uuidv4 } from 'uuid';
import { prosseserSkjema } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/Skjemavalidering';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  readOnly: boolean;
}

export interface Vurderinger {
  [ident: string]: ManueltBarnVurdering[];
}

export interface ManueltBarnVurdering {
  begrunnelse?: string;
  harForeldreAnsvar?: string;
  fom?: Date;
  tom?: Date;
  formId: string;
}

export interface ManueltBarnVurderingError {
  formId: string;
  felt: keyof ManueltBarnVurdering;
  message: string;
}

export const BarnetilleggVurdering = ({ grunnlag, behandlingsversjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const initialValue = grunnlag.barnSomTrengerVurdering.reduce((acc, barn) => {
    acc[barn.ident.identifikator] = [{ formId: uuidv4() }];
    return acc;
  }, {} as Vurderinger);

  const [vurderinger, setVurderinger] = useState<Vurderinger>(initialValue);
  const [dokumenter, setDokumenter] = useState<string[]>([]);
  const [errors, updateErrors] = useState<ManueltBarnVurderingError[]>([]);

  const handleInputChange = (
    ident: string,
    formId: string,
    field: keyof ManueltBarnVurdering,
    value: string | Date
  ) => {
    const updatedVurderinger = { ...vurderinger };
    const vurderingList = updatedVurderinger[ident];
    const manuellVurdering = vurderingList.find((v) => v.formId === formId);

    if (manuellVurdering) {
      // @ts-ignore TODO Finn ut hva som skjer her
      manuellVurdering[field] = value;
      setVurderinger(updatedVurderinger);
    }
  };

  const addManueltBarnVurdering = (ident: string) => {
    const newVurdering = {
      formId: uuidv4(),
    };

    setVurderinger((prevVurderinger) => ({
      ...prevVurderinger,
      [ident]: [...(prevVurderinger[ident] || []), newVurdering],
    }));
  };

  const removeManueltBarnVurdering = (ident: string, feltId: string) => {
    const updatedVurderinger = { ...vurderinger };
    updatedVurderinger[ident] = updatedVurderinger[ident].filter((v) => v.formId !== feltId);
    setVurderinger(updatedVurderinger);
  };

  return (
    <VilkårsKort
      heading={'Barnetillegg § 11-20 tredje og fjerde ledd'}
      icon={<ChildHairEyesIcon title="barnetilleg-ikon" fontSize="1.5rem" />}
      steg={'BARNETILLEGG'}
    >
      <div className={'flex-column'}>
        <CheckboxGroup
          legend={'Dokumenter funnet som er relevante for vurdering av barnetillegg §11-20'}
          description={'Les dokumentene og tilknytt eventuelle dokumenter benyttet til 11-20 vurderingen'}
          onChange={(value) => setDokumenter(value)}
        >
          <DokumentTabell />
        </CheckboxGroup>

        <TilknyttedeDokumenter dokumenter={dokumenter} />

        <div>
          <Label size={'small'}>Følgende barn er oppgitt av søker og må vurderes for barnetillegg</Label>
          <BodyShort size={'small'}>
            Les dokumentene og tilknytt relevante dokumenter til vurdering om det skal beregnes barnetillegg
          </BodyShort>
        </div>
        <>
          {Object.keys(vurderinger).map((ident) => (
            <section key={ident} className={`${styles.barnekort} flex-column`}>
              <div className={styles.manueltbarnheading}>
                <div>
                  <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'3rem'} />
                </div>
                <div>
                  <Heading size={'small'}>{ident}</Heading>
                </div>
              </div>
              <div>
                {vurderinger[ident].map((vurdering, manueltBarnVurderingIndex) => (
                  <div key={vurdering.formId} className={styles.vurdering}>
                    <ManueltBarn
                      key={manueltBarnVurderingIndex}
                      manueltBarn={vurdering}
                      readOnly={readOnly}
                      oppdaterVurdering={handleInputChange}
                      ident={ident}
                      errors={errors.filter((error) => error.formId === vurdering.formId)}
                    />
                    <Button
                      onClick={() => removeManueltBarnVurdering(ident, vurdering.formId)}
                      className={'fit-content-button'}
                      variant={'danger'}
                      size={'small'}
                    >
                      Fjern periode
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => addManueltBarnVurdering(ident)}
                className={'fit-content-button'}
                variant={'secondary'}
                size={'small'}
              >
                Legg til flere perioder
              </Button>
            </section>
          ))}
        </>

        {grunnlag.folkeregisterbarn && grunnlag.folkeregisterbarn.length > 0 && (
          <>
            <Label size={'small'}>Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg</Label>
            {grunnlag.folkeregisterbarn.map((barn, index) => (
              <RegistrertBarn key={index} registrertBarn={barn} />
            ))}
          </>
        )}

        {!readOnly && (
          <Button
            className={'fit-content-button'}
            form="dokument-form"
            onClick={() => {
              updateErrors([]);
              const valideringsresultat = prosseserSkjema(vurderinger);
              if ('errors' in valideringsresultat) {
                updateErrors(valideringsresultat.errors);
              } else {
                løsBehovOgGåTilNesteSteg({
                  behandlingVersjon: behandlingsversjon,
                  behov: {
                    behovstype: Behovstype.AVKLAR_BARNETILLEGG_KODE,
                    vurderingerForBarnetillegg: {
                      vurderteBarn: valideringsresultat.mappetSkjema,
                    },
                  },
                  referanse: behandlingsReferanse,
                });
              }
            }}
            loading={isLoading}
          >
            Bekreft
          </Button>
        )}
      </div>
    </VilkårsKort>
  );
};
