import { isLocal } from 'lib/utils/environment';
import { redirect } from 'next/navigation';

const lokalStartside = isLocal();
export default function Page() {
  if (lokalStartside) {
    redirect('/saksbehandling/saksoversikt');
  }
  redirect('/oppgave');
}
