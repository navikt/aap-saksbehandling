---
name: ny-form-med-useconfigform
description: Bygg skjema/modal i aap-saksbehandling med deklarativ useConfigForm og FormField i stedet for manuell react-hook-form og *Wrapper-komponenter. Bruk når du lager nye skjemaer, modaler eller skjemafelt.
---

# Skjema med `useConfigForm` + `FormField`

Nye skjemaer og modaler bruker det deklarative mønsteret:

- `components/form/FormHook.tsx` – `useConfigForm<T>(config)` returnerer `{ form, formFields }`
- `components/form/FormField.tsx` – `<FormField form={form} formField={formFields.felt} />` velger riktig wrapper basert på `type`

Ikke bruk manuell `useForm` + `FormProvider` + enkeltstående `TextAreaWrapper`/`DateInputWrapper` osv. i nye skjemaer. Eksisterende kode som gjør det trenger ikke endres uten at det er bedt om.

Referanse: `components/saksoversikt/meldekortoversikt/registrermeldedatomodal/RegistrerMeldedatoModal.tsx`.

## Mønster

```tsx
interface MinFormFields {
  begrunnelse: string;
  meldedato: string;
}

const { form, formFields } = useConfigForm<MinFormFields>({
  begrunnelse: {
    type: 'textarea',
    label: 'Begrunnelse',
    rules: { required: 'Du må skrive en begrunnelse' },
  },
  meldedato: {
    type: 'date_input',
    label: 'Dato',
    rules: {
      required: 'Du må velge en dato',
      validate: { ikkeIFremtiden: (v) => (erDatoIFremtiden(v) ? 'Datoen kan ikke være i fremtiden' : undefined) },
    },
  },
});

<form onSubmit={form.handleSubmit(onSubmit)}>
  <FormField form={form} formField={formFields.begrunnelse} />
  <FormField form={form} formField={formFields.meldedato} />
</form>;
```

## Felttyper (`FormFieldConfig`)

`text`, `number`, `textarea`, `date`, `date_month_picker`, `date_input`, `switch`, `radio`, `radio_nested`,
`select`, `checkbox`, `checkbox_nested`, `combobox`, `combobox_multiple`, `async_combobox`, `fieldArray`.
Se `FormHook.tsx` for eksakte typenavn og felter (`options`, `defaultValue`, `rules`, `readOnly`, `onChange`).
`FormField` har også props `readOnly`, `size`, `horizontalRadio`, `className`.

## Regler og fallgruver

- **Valideringsmeldinger på norsk bokmål**, tydelige og handlingsrettede ("Du må …"). Gjenbruk valideringsfunksjoner fra `lib/validation/` og `lib/utils/validering.ts`.
- **Tallfelt:** `TextFieldWrapper` sender rå input-event videre, så verdier fra `type='text'` forblir `string`. Konverter eksplisitt før numeriske sammenligninger og valider heltall ved behov.
- **Datoer:** skjemaverdi er `dd.MM.yyyy`; bruk `formaterDatoForBackend` / `formaterDatoForFrontend` (`lib/utils/date`) ved mapping til/fra backend.
- **Feilsammendrag:** for vilkårskort, bruk `hentFeilmeldingerForForm(form.formState.errors)` (`lib/utils/formerrors`).
- **Mellomlagring:** `useMellomlagring(behovstype, initial, form)` fungerer med `form` fra `useConfigForm`. Se skillen `nytt-vilkaarskort-steg`.
- **Dynamiske lister:** bruk `type: 'fieldArray'` i config og `useFieldArray({ control: form.control, name })` for `append/remove`. Felter inne i arrayen kan fortsatt trenge `*Wrapper` med dynamisk `name` (se `Soningsvurdering.tsx`).
- **Aksel:** bruk `@navikt/ds-react` v8 med spacing-tokens (`space-16` osv.); se skillen `aksel-spacing`.

## Test

Bruk `render` fra `lib/test/CustomRender`, `userEvent.setup()`, og søk etter felt med `screen.getByRole('textbox', { name: '...' })`. Test at påkrevde felt gir feilmelding og at gyldig innsending kaller riktig API.
