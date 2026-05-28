import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@navikt/oasis';
import { isLocal } from 'lib/utils/environment';

export function proxy(request: NextRequest) {
  if (isLocal()) return NextResponse.next();

  if (!getToken(request.headers)) {
    if (request.nextUrl.pathname.includes('/api/')) {
      return NextResponse.json(
        { type: 'ERROR', apiException: { message: 'Ikke autentisert' }, status: 401 },
        { status: 401 }
      );
    }
    return NextResponse.redirect(
      new URL(`/oauth2/login?redirect=${request.nextUrl.pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ['/saksbehandling/:path*', '/oppgave/:path*', '/postmottak/:path*'],
};
