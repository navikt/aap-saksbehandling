'use client';

import { useFieldArray } from 'react-hook-form';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { YrkesskadeTabell } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/yrkesskadetabell/YrkesskadeTabell';
import { BodyShort, Label } from '@navikt/ds-react';

import styles from './YrkesskadeGrunnlagBeregning.module.css';
import { MellomlagretVurdering, YrkeskadeBeregningGrunnlag, YrkesskadeBeløpVurderingResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { ValuePair } from 'components/form/FormField';
import { formaterTilNok } from 'lib/utils/string';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  behandlingVersjon: number;
  yrkeskadeBeregningGrunnlag: YrkeskadeBeregningGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  vurderinger: AntattÅrligInntektVurdering[];
}

interface AntattÅrligInntektVurdering {
  inntekt: string;
  begrunnelse: string;
  ref: string;
  skadetidspunkt: string;
  gverdi: number;
}

type DraftFormFields = Partial<FormFields>;

export const YrkesskadeGrunnlagBeregning = ({
  readOnly,
  yrkeskadeBeregningGrunnlag,
  behandlingVersjon,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_GRUNNLAG');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.FASTSETT_YRKESSKADEINNTEKT, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_BEREGNINGSTIDSPUNKT',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingerToDraftFormFields(yrkeskadeBeregningGrunnlag);

  const { form } = useConfigForm<FormFields>(
    {
      vurderinger: {
        type: 'fieldArray',
        defaultValue: defaultValue.vurderinger,
      },
    },
    { readOnly: formReadOnly }
  );

  const { fields } = useFieldArray({ control: form.control, name: 'vurderinger' });
  const vurdertAvAnsatt =
    yrkeskadeBeregningGrunnlag.vurderinger.length > 0 ? yrkeskadeBeregningGrunnlag.vurderinger[0].vurdertAv : undefined;

  const historiskeVurderinger = yrkeskadeBeregningGrunnlag?.historiskeVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Yrkesskade grunnlagsberegning §§ 11-19 / 11-22'}
      steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
      onSubmit={form.handleSubmit((data) => {
        løsBehovOgGåTilNesteSteg(
          {
            behov: {
              behovstype: Behovstype.FASTSETT_YRKESSKADEINNTEKT,
              yrkesskadeInntektVurdering: {
                vurderinger: data.vurderinger.map((vurdering) => {
                  return {
                    begrunnelse: vurdering.begrunnelse,
                    antattÅrligInntekt: { verdi: Number(vurdering.inntekt) },
                    referanse: vurdering.ref,
                  };
                }),
              },
            },
            referanse: behandlingsReferanse,
            behandlingVersjon: behandlingVersjon,
          },
          () => nullstillMellomlagretVurdering()
        );
      })}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={vurdertAvAnsatt}
      readOnly={readOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => {
          form.reset(mapVurderingerToDraftFormFields(yrkeskadeBeregningGrunnlag));
        })
      }
      visningModus={visningModus}
      visningActions={visningActions}
    >
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => deepEqual(v, historiskeVurderinger[historiskeVurderinger.length - 1])}
          getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}

      <YrkesskadeTabell
        yrkesskader={yrkeskadeBeregningGrunnlag.skalVurderes.map((vurdering) => {
          return {
            ref: vurdering.referanse,
            saksnummer: vurdering.saksnummer,
            kilde: vurdering.kilde,
            skadedato: vurdering.skadeDato,
          };
        })}
      />
      {fields.map((field, index) => {
        const grunnlag = Number(form.watch(`vurderinger.${index}.inntekt`)) / field.gverdi;

        return (
          <div key={field.id} className={'flex-column'}>
            <TextAreaWrapper
              name={`vurderinger.${index}.begrunnelse`}
              control={form.control}
              label={`Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}
              readOnly={formReadOnly}
              className={'begrunnelse'}
              rules={{ required: 'Du må oppgi en begrunnelse for anslått arbeidsinntekt.' }}
            />
            <div className={styles.inntektfelt}>
              <Label size="small">{`Anslått årlig arbeidsinntekt på skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}</Label>
              <div className={styles.inntektwrapper}>
                <TextFieldWrapper
                  label={`Anslått årlig arbeidsinntekt på skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}
                  hideLabel
                  name={`vurderinger.${index}.inntekt`}
                  control={form.control}
                  type={'number'}
                  className={'inntekt_input'}
                  readOnly={formReadOnly}
                  rules={{
                    required: 'Du må oppgi anslått årlig arbeidsinntekt på skadetidspunkt.',
                    min: { value: 0, message: 'Inntekt kan ikke være negativ.' },
                  }}
                />
                <BodyShort>{grunnlag.toFixed(2)} G</BodyShort>
              </div>
            </div>
          </div>
        );
      })}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingerToDraftFormFields(grunnlag: YrkeskadeBeregningGrunnlag): DraftFormFields {
  return {
    vurderinger: grunnlag.skalVurderes.map((yrkesskade) => {
      const vurdertYrkesskade = grunnlag.vurderinger.find((vurdering) => vurdering.referanse === yrkesskade.referanse);
      return {
        ref: yrkesskade.referanse,
        gverdi: yrkesskade.grunnbeløp.verdi,
        skadetidspunkt: yrkesskade.skadeDato,
        inntekt: vurdertYrkesskade ? vurdertYrkesskade.antattÅrligInntekt.verdi.toString() : '',
        begrunnelse: vurdertYrkesskade ? vurdertYrkesskade.begrunnelse : '',
      };
    }),
  };
}

const byggFelter = (vurdering: YrkesskadeBeløpVurderingResponse): ValuePair[] => [
  {
    label: 'Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt',
    value: vurdering.begrunnelse || '-',
  },
  {
    label: 'Anslått årlig arbeidsinntekt på skadetidspunkt',
    value: vurdering.antattÅrligInntekt.verdi ? formaterTilNok(vurdering.antattÅrligInntekt.verdi) : '-',
  },
];
