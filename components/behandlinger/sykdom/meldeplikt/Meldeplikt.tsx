'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, Button, List, ReadMore } from '@navikt/ds-react';
import { FigureIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent, useState } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Periodetabell } from './Periodetabell';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

import styles from './Meldeplikt.module.css';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useFieldArray } from 'react-hook-form';
import {
  harPerioderSomOverlapper,
  sjekkOmPerioderInkludererDatoer,
} from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: FritakMeldepliktGrunnlag;
}

export interface MeldepliktPeriode {
  fritakFraMeldeplikt: JaEllerNei | string;
  fom: string;
  tom: string;
}

export type FritakMeldepliktFormFields = {
  begrunnelse: string;
  fritaksvurdering: MeldepliktPeriode[];
};

export const Meldeplikt = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const { form, formFields } = useConfigForm<FritakMeldepliktFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder innbyggers behov for fritak fra meldeplikt',
        description: 'Begrunn vurderingen',
        rules: { required: 'Du må begrunne vurderingen din' },
        defaultValue: grunnlag?.vurderinger[0].begrunnelse,
      },
      fritaksvurdering: {
        type: 'fieldArray',
        defaultValue: grunnlag?.vurderinger.map((v) => ({
          fritakFraMeldeplikt: v.fritaksperioder[0].harFritak ? JaEllerNei.Ja : JaEllerNei.Nei,
          fom: formaterDatoForFrontend(v.fritaksperioder[0].periode.fom),
          tom: v.fritaksperioder[0].periode.tom ? formaterDatoForFrontend(v.fritaksperioder[0].periode.tom) : '',
        })) || [{ fritakFraMeldeplikt: '', fom: '', tom: '' }],
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'fritaksvurdering' });

  const [harOverlappendePerioder, oppdaterHarOverlappendePerioder] = useState<boolean>(false);
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    oppdaterHarOverlappendePerioder(false);
    form.handleSubmit((data) => {
      const perioderMedFritak = data.fritaksvurdering
        .filter((periode) => periode.fritakFraMeldeplikt === JaEllerNei.Ja)
        .map((periode) => ({
          fom: periode.fom,
          tom: periode.tom,
        }));
      const perioderOverlapper = perioderMedFritak.length > 0 && harPerioderSomOverlapper(perioderMedFritak);
      const datoerUtenFritak = data.fritaksvurdering
        .filter((periode) => periode.fritakFraMeldeplikt === JaEllerNei.Nei)
        .map((periode) => periode.fom);

      const periodeUtenFritakErIPeriodeMedFritak = sjekkOmPerioderInkludererDatoer(datoerUtenFritak, perioderMedFritak);

      if (perioderOverlapper || periodeUtenFritakErIPeriodeMedFritak) {
        oppdaterHarOverlappendePerioder(true);
      } else {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsReferanse,
          behov: {
            behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
            fritaksvurdering: {
              begrunnelse: data.begrunnelse,
              fritaksPerioder: data.fritaksvurdering.map((v) => {
                if (v.fritakFraMeldeplikt === JaEllerNei.Nei) {
                  return {
                    harFritak: false,
                    periode: {
                      fom: formaterDatoForBackend(parse(v.fom, 'dd.MM.yyyy', new Date())),
                    },
                  };
                } else {
                  return {
                    harFritak: v.fritakFraMeldeplikt === JaEllerNei.Ja,
                    periode: {
                      fom: formaterDatoForBackend(parse(v.fom, 'dd.MM.yyyy', new Date())),
                      tom: formaterDatoForBackend(parse(v.tom, 'dd.MM.yyyy', new Date())),
                    },
                  };
                }
              }),
            },
          },
        });
      }
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
        steg={'FRITAK_MELDEPLIKT'}
        visBekreftKnapp={!readOnly}
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

        <FormField form={form} formField={formFields.begrunnelse} />
        <Veiledning
          header={'Slik vurderes dette'}
          defaultOpen={false}
          tekst={
            <>
              <BodyShort>
                Unødig tyngende betyr at plikten til å sende meldekort være vanskeligere å oppfylle enn for andre
                mottakere av AAP – det er ikke tilstrekkelig at meldeplikten er tung eller belastende for personen.
              </BodyShort>
              <BodyShort>
                Fritak kan for eksempel gis hvis det er hindre som gjør det vanskelig for personen å fylle ut
                meldekortet riktig, for eksempel synshemming, lese- og skrivevansker eller psykisk utviklingshemming.
                Det kan også gis fritak om en person er lagt inn på institusjon og/eller er i en slik helsetilstand at
                det ikke er mulig å sende inn meldekort
              </BodyShort>
            </>
          }
        />
        <Periodetabell
          perioder={fields}
          vurderingstidspunkt={grunnlag?.vurderinger[0].vurderingsTidspunkt}
          readOnly={readOnly}
          form={form}
          remove={remove}
        />
        <p className={`navds-error-message navds-label ${styles.periodeoverlapp_feilmelding}`}>
          {harOverlappendePerioder && 'Det finnes overlappende perioder'}
        </p>

        {!readOnly && (
          <Button
            variant={'tertiary'}
            icon={<PlusCircleIcon />}
            type={'button'}
            onClick={() => append({ fritakFraMeldeplikt: '', fom: '', tom: '' })}
          >
            Legg til periode med fritak
          </Button>
        )}
      </Form>
    </VilkårsKort>
  );
};
