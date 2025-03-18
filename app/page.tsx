import { isLocal } from 'lib/utils/environment';
import { redirect } from 'next/navigation';

export default function Page() {
  if (!isLocal()) {
    redirect('/saksbehandling/saksoversikt');
  }
  redirect('/oppgave');
}
