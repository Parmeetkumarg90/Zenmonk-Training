import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const middleware = async (request: NextRequest) => {
    const cookieStore = await cookies();
    const credentials = cookieStore.get("credentials");
    switch (request.nextUrl.pathname) {
        case "/dashboard":
            if (!credentials) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            break;
        default:
    }
}


// See "Matching Paths" below to learn more
const config = {
    matcher: '/dashboard',
}
export { config, middleware };