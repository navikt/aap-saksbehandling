'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, Button, List, ReadMore, Textarea } from '@navikt/ds-react';
import { FigureIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { FritakMeldepliktGrunnlag, FritakMeldepliktVurdering, Periode } from 'lib/types/types';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useState } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Periodetabell } from './Periodetabell';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { isBefore, parse } from 'date-fns';
import { harPerioderSomOverlapper, sjekkOmPerioderInkludererDatoer } from './Periodevalidering';

import styles from './Meldeplikt.module.css';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: FritakMeldepliktGrunnlag;
}

export interface MeldepliktPeriode {
  fritakFraMeldeplikt?: string;
  fom?: string;
  tom?: string;
}

export type Valideringsfeil = {
  felt: keyof MeldepliktPeriode | 'begrunnelse' | 'periodeoverlapp';
  index: number;
  message: string;
};

export const Meldeplikt = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const initialState =
    grunnlag?.vurderinger && grunnlag.vurderinger.length > 0
      ? grunnlag.vurderinger.map((vurdering) => ({
          fritakFraMeldeplikt: getJaNeiEllerUndefined(vurdering.harFritak),
          fom: formaterDatoForFrontend(vurdering.periode.fom),
          tom: vurdering.periode.tom ? formaterDatoForFrontend(vurdering.periode.tom) : '',
        }))
      : [{ fritakFraMeldeplikt: '', fom: '', tom: '' }];

  const [begrunnelse, oppdaterBegrunnelse] = useState<string | undefined>(grunnlag?.begrunnelse);
  const [perioder, oppdaterPerioder] = useState<MeldepliktPeriode[]>(initialState);
  const [skjemafeil, oppdaterSkjemafeil] = useState<Valideringsfeil[]>([]);
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');

  const leggTilRad = () =>
    oppdaterPerioder((prevState) => [...prevState, { fritakFraMeldeplikt: undefined, fom: undefined, tom: undefined }]);

  const validerOgMapSkjema = () => {
    const errors: Valideringsfeil[] = [];
    const mappetSkjema: FritakMeldepliktVurdering[] = [];
    if (!begrunnelse) {
      errors.push({
        index: -1,
        felt: 'begrunnelse',
        message: 'Du må begrunne vurderingen din',
      });
    }

    perioder.forEach((periode, index) => {
      if (!periode.fritakFraMeldeplikt) {
        errors.push({
          index: index,
          felt: 'fritakFraMeldeplikt',
          message: 'Du må ta stilling til om bruker skal ha fritak fra meldeplikten eller ikke',
        });
      }
      if (!periode.fom) {
        errors.push({
          index: index,
          felt: 'fom',
          message: 'Du må legge inn en dato for når perioden starter',
        });
      } else if (periode.fom) {
        if (!stringToDate(periode.fom, 'dd.MM.yyyy')) {
          errors.push({
            index: index,
            felt: 'fom',
            message: 'Ugyldig dato',
          });
        }
      }

      if (periode.fritakFraMeldeplikt === JaEllerNei.Ja && !periode.tom) {
        errors.push({
          index: index,
          felt: 'tom',
          message: 'Du må legge inn en dato for når perioden slutter',
        });
      } else if (periode.tom) {
        if (!stringToDate(periode.tom, 'dd.MM.yyyy')) {
          errors.push({
            index: index,
            felt: 'tom',
            message: 'Ugyldig dato',
          });
        }
      }

      if (periode.fritakFraMeldeplikt === JaEllerNei.Ja && periode.tom && periode.fom) {
        const fom = parse(periode.fom, 'dd.MM.yyyy', new Date());
        const tom = parse(periode.tom, 'dd.MM.yyyy', new Date());
        if (isBefore(tom, fom)) {
          errors.push({
            index: index,
            felt: 'fom',
            message: 'Slutt-dato kan ikke være før start-dato',
          });
        }
      }

      if (periode.fom && periode.fritakFraMeldeplikt) {
        if (!periode.tom) {
          mappetSkjema.push({
            harFritak: periode.fritakFraMeldeplikt === JaEllerNei.Ja,
            periode: {
              fom: formaterDatoForBackend(parse(periode.fom, 'dd.MM.yyyy', new Date())),
            },
          });
        } else {
          mappetSkjema.push({
            harFritak: periode.fritakFraMeldeplikt === JaEllerNei.Ja,
            periode: {
              fom: formaterDatoForBackend(parse(periode.fom, 'dd.MM.yyyy', new Date())),
              tom: formaterDatoForBackend(parse(periode.tom, 'dd.MM.yyyy', new Date())),
            },
          });
        }
      }
    });

    if (errors.length === 0) {
      const perioder: Periode[] = [];
      mappetSkjema
        .filter((periode) => periode.harFritak)
        .forEach((periode) => {
          if (periode.periode.tom) {
            perioder.push({
              fom: periode.periode.fom,
              tom: periode.periode.tom,
            });
          }
        });

      if (harPerioderSomOverlapper(perioder)) {
        errors.push({
          index: -1,
          felt: 'periodeoverlapp',
          message: 'Det finnes overlappende perioder.',
        });
      }
      // sjekk om det finnes datoer uten fritak som ligger i en periode
      if (errors.length === 0) {
        const perioderUtenFritak: string[] = mappetSkjema
          .filter((periode) => !periode.harFritak)
          .map((periode) => periode.periode.fom);
        const perioderMedFritak: Periode[] = [];
        mappetSkjema
          .filter((periode) => periode.harFritak)
          .forEach((periode) => {
            if (periode.periode.tom) {
              perioderMedFritak.push({
                fom: periode.periode.fom,
                tom: periode.periode.tom,
              });
            }
          });
        if (perioderUtenFritak.length > 0 && perioderMedFritak.length > 0) {
          if (sjekkOmPerioderInkludererDatoer(perioderUtenFritak, perioderMedFritak)) {
            errors.push({
              index: -1,
              felt: 'periodeoverlapp',
              message: 'Det finnes overlappende perioder.',
            });
          }
        }
      }
    }

    return { errors, mappetSkjema };
  };

  const handleSubmit = () => {
    const { errors, mappetSkjema } = validerOgMapSkjema();

    oppdaterSkjemafeil([]);
    if (errors.length > 0 || !begrunnelse) {
      oppdaterSkjemafeil(errors);
    } else {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsReferanse,
        behov: {
          behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
          fritaksvurdering: {
            begrunnelse: begrunnelse,
            fritaksPerioder: mappetSkjema,
          },
        },
      });
    }
  };

  return (
    <VilkårsKort
      heading={'Unntak fra meldeplikt § 11-10'}
      steg="FRITAK_MELDEPLIKT"
      icon={<FigureIcon fontSize={'inherit'} />}
      vilkårTilhørerNavKontor={true}
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

      <Textarea
        onChange={(event) => oppdaterBegrunnelse(event.currentTarget.value)}
        label={'Vurder om det vil være unødig tyngende for søker å overholde meldeplikten'}
        description={'Begrunn vurderingen'}
        value={begrunnelse}
        error={skjemafeil.find((feil) => feil.felt === 'begrunnelse')?.message}
        readOnly={readOnly}
      />
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
              Fritak kan for eksempel gis hvis det er hindre som gjør det vanskelig for personen å fylle ut meldekortet
              riktig, for eksempel synshemming, lese- og skrivevansker eller psykisk utviklingshemming. Det kan også gis
              fritak om en person er lagt inn på institusjon og/eller er i en slik helsetilstand at det ikke er mulig å
              sende inn meldekort
            </BodyShort>
          </>
        }
      />

      <Periodetabell
        perioder={perioder}
        oppdaterPerioder={oppdaterPerioder}
        vurderingstidspunkt={grunnlag?.vurderingsTidspunkt}
        valideringsfeil={skjemafeil}
        readOnly={readOnly}
      />
      <p className={`navds-error-message navds-label ${styles.periodeoverlapp_feilmelding}`}>
        {skjemafeil.find((feil) => feil.felt === 'periodeoverlapp')?.message}
      </p>

      {!readOnly && (
        <Button variant={'tertiary'} icon={<PlusCircleIcon />} type={'button'} onClick={() => leggTilRad()}>
          Legg til periode med fritak
        </Button>
      )}
      <div>
        {!readOnly && (
          <Button className={'fit-content-button'} form="dokument-form" onClick={handleSubmit} loading={isLoading}>
            Bekreft
          </Button>
        )}
      </div>
    </VilkårsKort>
  );
};
