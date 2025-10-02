export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.redirect(new URL(`/c/${performance.now()}_${Math.random()}`, request.url))
}
