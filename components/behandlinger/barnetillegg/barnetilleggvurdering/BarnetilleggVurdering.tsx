'use client';

import { ChildHairEyesIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button, Label } from '@navikt/ds-react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { BarnetilleggGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';
import { DATO_FORMATER, formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { OppgitteBarnVurdering } from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  readOnly: boolean;
}

export interface BarnetilleggFormFields {
  barnetilleggVurderinger: BarneTilleggVurdering[];
}

interface BarneTilleggVurdering {
  ident: string;
  fødselsdato: string;
  navn: string;
  vurderinger: Vurdering[];
}

interface Vurdering {
  begrunnelse: string;
  harForeldreAnsvar: string;
  fom: string;
  tom?: string;
}

export const BarnetilleggVurdering = ({ grunnlag, behandlingsversjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const { form } = useConfigForm<BarnetilleggFormFields>({
    barnetilleggVurderinger: {
      type: 'fieldArray',
      defaultValue: grunnlag.barnSomTrengerVurdering.map((barn) => {
        return {
          ident: barn.ident.identifikator,
          fødselsdato: barn.fødselsdato,
          navn: 'Barnet sitt navn',
          vurderinger: [{ begrunnelse: '', harForeldreAnsvar: '', fom: '' }],
        };
      }),
    },
  });

  const { fields: barnetilleggVurderinger } = useFieldArray({
    control: form.control,
    name: 'barnetilleggVurderinger',
  });

  return (
    <VilkårsKort
      heading={'Barnetillegg § 11-20 tredje og fjerde ledd'}
      icon={<ChildHairEyesIcon title="barnetilleg-ikon" fontSize="1.5rem" />}
      steg={'BARNETILLEGG'}
    >
      <div className={'flex-column'}>
        {grunnlag.barnSomTrengerVurdering && grunnlag.barnSomTrengerVurdering.length > 0 && (
          <div className={'flex-column'}>
            <div>
              <Label size={'medium'}>Følgende barn er oppgitt av søker og må vurderes for barnetillegg</Label>
            </div>

            <form
              className={'flex-column'}
              id={'barnetillegg'}
              onSubmit={form.handleSubmit((data) => {
                løsBehovOgGåTilNesteSteg({
                  behandlingVersjon: behandlingsversjon,
                  behov: {
                    behovstype: Behovstype.AVKLAR_BARNETILLEGG_KODE,
                    vurderingerForBarnetillegg: {
                      vurderteBarn: data.barnetilleggVurderinger.map((vurderteBarn) => {
                        return {
                          ident: { identifikator: vurderteBarn.ident, aktivIdent: false },
                          vurderinger: vurderteBarn.vurderinger.map((vurdering) => {
                            return {
                              begrunnelse: vurdering.begrunnelse,
                              harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
                              periode: {
                                fom: vurdering.fom
                                  ? formaterDatoForBackend(parse(vurdering.fom, DATO_FORMATER.ddMMyyyy, new Date()))
                                  : '',
                                tom: vurdering.tom
                                  ? formaterDatoForBackend(parse(vurdering.tom, DATO_FORMATER.ddMMyyyy, new Date()))
                                  : '',
                              },
                            };
                          }),
                        };
                      }),
                    },
                  },
                  referanse: behandlingsReferanse,
                });
              })}
            >
              {barnetilleggVurderinger.map((vurdering, barnetilleggIndex) => {
                return (
                  <OppgitteBarnVurdering
                    key={vurdering.id}
                    form={form}
                    barnetilleggIndex={barnetilleggIndex}
                    ident={vurdering.ident}
                    fødselsdato={vurdering.fødselsdato}
                    navn={vurdering.navn}
                    readOnly={readOnly}
                  />
                );
              })}
            </form>
          </div>
        )}

        {grunnlag.folkeregisterbarn && grunnlag.folkeregisterbarn.length > 0 && (
          <div className={'flex-column'}>
            <Label size={'medium'}>Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg</Label>
            {grunnlag.folkeregisterbarn.map((barn, index) => (
              <RegistrertBarn key={index} registrertBarn={barn} />
            ))}
          </div>
        )}

        {!readOnly && (
          <Button className={'fit-content-button'} form={'barnetillegg'} loading={isLoading}>
            Bekreft
          </Button>
        )}
      </div>
    </VilkårsKort>
  );
};
