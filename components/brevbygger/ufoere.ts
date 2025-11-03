import { BrevmalType } from 'components/brevbygger/brevmodellTypes';

export const ufoere: BrevmalType = {
  _createdAt: '2025-10-21T11:17:16Z',
  _id: '16c72928-a097-4faf-933a-50637f70c369',
  _originalId: '16c72928-a097-4faf-933a-50637f70c369',
  _rev: 'jDBW1BLVeruecQz6Ju88aU',
  _system: {
    base: {
      id: '16c72928-a097-4faf-933a-50637f70c369',
      rev: 'fUnypQWkwSwiyCaTjiRikZ',
    },
  },
  _type: 'mal',
  _updatedAt: '2025-10-24T07:01:23Z',
  beskrivelse: '11-9: Reduksjon',
  delmaler: [
    {
      _key: '10771ec01298',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-21T11:18:46Z',
        _id: '8e2be21c-43b2-45cf-8ee3-4218539f3025',
        _originalId: '8e2be21c-43b2-45cf-8ee3-4218539f3025',
        _rev: 'fUnypQWkwSwiyCaTjiOg5T',
        _system: {
          base: {
            id: '8e2be21c-43b2-45cf-8ee3-4218539f3025',
            rev: '5gPw1BcnJ1mY3wboHLBH0r',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-10-21T11:41:33Z',
        beskrivelse: '11-9: Reduksjon av AAP',
        overskrift: 'Vedtak',
        teksteditor: [
          {
            _key: '6e968e858844',
            _type: 'block',
            children: [
              {
                _key: '42a422d23010',
                _type: 'span',
                marks: [],
                text: 'Du får redusert utbetalingen av arbeidsavklaringspenger med én dag.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: '9fbfa0ba0178',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-21T11:42:14Z',
        _id: '330c033f-1a1f-44d5-8814-0bc95ecb8c17',
        _originalId: '330c033f-1a1f-44d5-8814-0bc95ecb8c17',
        _rev: 'jDBW1BLVeruecQz6JuIzxS',
        _system: {
          base: {
            id: '330c033f-1a1f-44d5-8814-0bc95ecb8c17',
            rev: 'fUnypQWkwSwiyCaTjiOpWK',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-10-24T07:31:16Z',
        beskrivelse: 'Beskrivelse av 11-9',
        overskrift: 'For å ha rett til aktivitetsplikt',
        paragraf: '11-9',
        teksteditor: [
          {
            _key: '9d6a526e9380',
            _type: 'block',
            children: [
              {
                _key: '105660350a93',
                _type: 'span',
                marks: [],
                text: 'For å ha rett til AAP, må du delta på møtene vi innkaller deg til. Du må også møte på arbeidsrettede tiltak eller behandling som er avtalt i aktivitetsplanen din, og sende inn dokumentasjon vi har bedt om.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '7af375dfb184',
            _type: 'block',
            children: [
              {
                _key: 'e3878a52aaf7',
                _type: 'span',
                marks: [],
                text: 'Hvis du uten rimelig grunn lar være å komme på møter eller ikke gjennomfører avtalte aktiviteter, kan vi redusere utbetalingen din.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
          {
            _key: '47ddcd4c91f4',
            _type: 'block',
            children: [
              {
                _key: '3fda92046d39',
                _type: 'span',
                marks: [],
                text: 'Dette kommer frem av folketrygdloven § 11-9 og forskrift om arbeidsavklaringspenger § 4.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      obligatorisk: false,
    },
    {
      _key: 'dfa47ef4d433',
      _type: 'delmalRef',
      delmal: {
        _createdAt: '2025-10-21T11:42:59Z',
        _id: '451b3d98-855a-4a38-9dc0-4ae342f2174a',
        _originalId: '451b3d98-855a-4a38-9dc0-4ae342f2174a',
        _rev: 'O8b3YIqWeCViTwqI0CDWfT',
        _system: {
          base: {
            id: '451b3d98-855a-4a38-9dc0-4ae342f2174a',
            rev: 'O8b3YIqWeCViTwqI0CDVBn',
          },
        },
        _type: 'delmal',
        _updatedAt: '2025-10-21T11:44:24Z',
        beskrivelse: '11-9: Begrunnelse',
        overskrift: 'Derfor får du redusert AAP',
        teksteditor: [
          {
            _key: '4a67e97756d2',
            _type: 'fritekst',
            fritekst: 'fritekst',
          },
        ],
      },
      obligatorisk: false,
    },
  ],
  journalposttittel: 'Uføre - reduksjon',
  kanSendesAutomatisk: false,
  overskrift: 'Nav reduserer utbetalingen av dine arbeidsavklaringspenger med én dag',
};
