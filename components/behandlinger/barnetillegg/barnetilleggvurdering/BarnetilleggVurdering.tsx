'use client';

import { ChildHairEyesIcon, QuestionmarkDiamondIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, Button, CheckboxGroup, Heading, Label } from '@navikt/ds-react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { BarnetilleggGrunnlag, VurdertBarn } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useState } from 'react';
import styles from 'components/barn/Barn.module.css';
import { ManueltBarn } from 'components/barn/manueltbarn/ManueltBarn';

import { v4 as uuidv4 } from 'uuid';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { formaterDatoForBackend } from 'lib/utils/date';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  readOnly: boolean;
}

interface Vurdering {
  [ident: string]: ManueltBarnVurdering[];
}

export interface ManueltBarnVurdering {
  begrunnelse?: string;
  harForelderAnsvar?: string;
  fom?: Date;
  tom?: Date;
  feltId: string;
}

export const BarnetilleggVurdering = ({ grunnlag, behandlingsversjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const initialValue = grunnlag.barnSomTrengerVurdering.reduce((acc, barn) => {
    acc[barn.ident.identifikator] = [{ feltId: uuidv4() }];
    return acc;
  }, {} as Vurdering);

  const [vurderinger, setVurderinger] = useState<Vurdering>(initialValue);
  const [dokumenter, setDokumenter] = useState<string[]>([]);

  const handleInputChange = (
    ident: string,
    feltId: string,
    field: keyof ManueltBarnVurdering,
    value: string | Date
  ) => {
    const updatedVurderinger = { ...vurderinger };
    const vurderingList = updatedVurderinger[ident];
    const manualVurd = vurderingList.find((v) => v.feltId === feltId);

    if (manualVurd) {
      // @ts-ignore TODO Finn ut hva som skjer her
      manualVurd[field] = value;
      setVurderinger(updatedVurderinger);
    }
  };

  const addManueltBarnVurdering = (ident: string) => {
    const newVurdering = {
      feltId: uuidv4(),
    };

    setVurderinger((prevVurderinger) => ({
      ...prevVurderinger,
      [ident]: [...(prevVurderinger[ident] || []), newVurdering],
    }));
  };

  const removeManueltBarnVurdering = (ident: string, feltId: string) => {
    const updatedVurderinger = { ...vurderinger };
    updatedVurderinger[ident] = updatedVurderinger[ident].filter((v) => v.feltId !== feltId);
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
            <section key={ident} className={styles.barnekort}>
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
                  <div key={vurdering.feltId}>
                    <ManueltBarn
                      key={manueltBarnVurderingIndex}
                      manueltBarn={vurdering}
                      readOnly={readOnly}
                      oppdaterVurdering={handleInputChange}
                      ident={ident}
                    />
                    <Button onClick={() => removeManueltBarnVurdering(ident, vurdering.feltId)}>Fjern periode</Button>
                  </div>
                ))}
              </div>
              <Button onClick={() => addManueltBarnVurdering(ident)}>Legg til flere perioder</Button>
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
              // TODO Skriv noe valideringsregler her
              // const validerteVurderinger = validerVurderinger();

              const vurderteBarn: VurdertBarn[] = Object.keys(vurderinger).map((ident) => {
                return {
                  ident: { identifikator: ident, aktivIdent: true },
                  vurderinger: vurderinger[ident].map((vurdering) => {
                    return {
                      begrunnelse: vurdering.begrunnelse || '',
                      harForeldreAnsvar: vurdering.harForelderAnsvar === JaEllerNei.Ja,
                      periode: {
                        fom: vurdering.fom ? formaterDatoForBackend(vurdering.fom) : formaterDatoForBackend(new Date()),
                        tom: vurdering.tom ? formaterDatoForBackend(vurdering.tom) : formaterDatoForBackend(new Date()),
                      },
                    };
                  }),
                };
              });

              løsBehovOgGåTilNesteSteg({
                behandlingVersjon: behandlingsversjon,
                behov: {
                  behovstype: Behovstype.AVKLAR_BARNETILLEGG_KODE,
                  vurderingerForBarnetillegg: {
                    vurderteBarn: vurderteBarn,
                  },
                },
                referanse: behandlingsReferanse,
              });
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
