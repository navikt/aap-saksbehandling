import { SanityAttributes, DelmalReferanse } from 'components/brevbygger/brevmodellTypes';

export const sanityAttrs: Omit<SanityAttributes, '_id'> = {
  _createdAt: new Date().toISOString(),
  _originalId: '99',
  _rev: '0',
  _system: {
    base: { id: 'base_id', rev: 'base_rev' },
  },
  _type: 'mal',
  _updatedAt: new Date().toISOString(),
};

export const valgfriDelmal: DelmalReferanse = {
  _key: 'valgfriDelmalKey',
  _type: 'delmalRef',
  delmal: {
    ...sanityAttrs,
    _id: 'valgfriDelmal',
    beskrivelse: 'En valgfri delmal',
    teksteditor: [
      {
        _key: 'teksteditor-key',
        _type: 'fritekst',
        fritekst: '',
      },
    ],
  },
  obligatorisk: false,
};

export const obligatoriskDelmal: DelmalReferanse = {
  _key: 'obligatoriskDelmalKey',
  _type: 'delmalRef',
  delmal: {
    ...sanityAttrs,
    _id: 'obligatoriskDelmal',
    beskrivelse: 'En obligatorisk delmal',
    teksteditor: [
      {
        _key: 'obligatoriskTekstEditorKey',
        _type: 'block',
        style: 'normal',
        children: [
          {
            _key: 'obligatoriskBlockKey',
            text: 'Tekst fra obligatorisk delmal',
            _type: 'span',
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
  },
  obligatorisk: true,
};

export const valgfriDelmalMedAlternativer: DelmalReferanse = {
  _key: 'valgfriDelmalKey',
  _type: 'delmalRef',
  delmal: {
    ...sanityAttrs,
    _id: '1',
    beskrivelse: 'En valgfri delmal',
    teksteditor: [
      {
        _key: 'valgRef-key',
        _type: 'valgRef',
        obligatorisk: true,
        valg: {
          ...sanityAttrs,
          _id: 'valgref-1',
          beskrivelse: 'Beskrivelse av alternativ',
          alternativer: [
            {
              _key: 'alt1-key',
              _type: 'kategorisertTekstRef',
              kategori: null,
              tekst: {
                ...sanityAttrs,
                _id: 'tekstid-1',
                beskrivelse: 'Alternativ 1',
                teksteditor: [
                  {
                    _id: 'text-1',
                    _key: 'text-key-1',
                    _type: 'block',
                    children: [],
                    markDefs: [],
                    style: 'none',
                  },
                ],
              },
            },
            {
              _key: 'alt2-key',
              _type: 'kategorisertTekstRef',
              kategori: null,
              tekst: {
                ...sanityAttrs,
                _id: 'tekstid-2',
                beskrivelse: 'Alternativ 2',
                teksteditor: [
                  {
                    _id: 'text-2',
                    _key: 'text-key-2',
                    _type: 'block',
                    children: [],
                    markDefs: [],
                    style: 'none',
                  },
                ],
              },
            },
            {
              _key: 'alt3-key',
              _type: 'fritekst',
              fritekst: '',
            },
          ],
        },
      },
    ],
  },
  obligatorisk: false,
};

export const obligatoriskDelmalMedAlternativer: DelmalReferanse = {
  _key: 'obligatoriskDelmalKey',
  _type: 'delmalRef',
  delmal: {
    ...sanityAttrs,
    _id: '1',
    beskrivelse: 'En obligatorisk delmal',
    teksteditor: [
      {
        _key: 'valgRef-key',
        _type: 'valgRef',
        obligatorisk: true,
        valg: {
          ...sanityAttrs,
          _id: 'valgref-1',
          beskrivelse: 'Beskrivelse av alternativ',
          alternativer: [
            {
              _key: 'alt1-key',
              _type: 'kategorisertTekstRef',
              kategori: null,
              tekst: {
                ...sanityAttrs,
                _id: 'tekstid-1',
                beskrivelse: 'Alternativ 1',
                teksteditor: [
                  {
                    _id: 'text-1',
                    _key: 'text-key-1',
                    _type: 'block',
                    children: [],
                    markDefs: [],
                    style: 'none',
                  },
                ],
              },
            },
            {
              _key: 'alt2-key',
              _type: 'kategorisertTekstRef',
              kategori: null,
              tekst: {
                ...sanityAttrs,
                _id: 'tekstid-2',
                beskrivelse: 'Alternativ 2',
                teksteditor: [
                  {
                    _id: 'text-2',
                    _key: 'text-key-2',
                    _type: 'block',
                    children: [],
                    markDefs: [],
                    style: 'none',
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  obligatorisk: true,
};
