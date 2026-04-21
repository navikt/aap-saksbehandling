'use client';

import { Timeline } from '@navikt/ds-react';
import { VisuellTidslinjeArbeidInntekt } from 'lib/types/types';
import { formaterPeriode } from 'lib/utils/date';

interface Props {
  visuellTidslinje: VisuellTidslinjeArbeidInntekt[];
}

export function VisuellTidslinjeInnhold({ visuellTidslinje }: Props) {
  const datoer = visuellTidslinje.flatMap((it) => [new Date(it.periode.fom), new Date(it.periode.tom)]);

  const startDate = new Date(Math.min(...datoer.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...datoer.map((d) => d.getTime())));

  return (
    <Timeline startDate={startDate} endDate={endDate}>
      <Timeline.Row label={''}>
        {visuellTidslinje.map((item, i) => {
          return (
            <Timeline.Period
              key={i}
              start={new Date(item.periode.fom)}
              end={new Date(item.periode.tom)}
              status={item.periodeMangler ? 'danger' : 'success'}
              statusLabel={'Inntektstidslinje'}
            >
              {item.periodeMangler ? (
                <div>
                  <div>
                    <b>{formaterPeriode(item.periode.fom, item.periode.tom)}</b>
                  </div>
                  <div>Inntekt mangler</div>
                </div>
              ) : (
                <div>
                  <div>
                    <b>{formaterPeriode(item.periode.fom, item.periode.tom)}</b>
                  </div>
                  <div>
                    {item.virksomhetNavn} (org.nr: {item.virksomhetId})
                  </div>
                  <div>Inntekt: {item.beloep}</div>
                </div>
              )}
            </Timeline.Period>
          );
        })}
      </Timeline.Row>
    </Timeline>
  );
}
