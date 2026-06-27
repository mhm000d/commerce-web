const API_BASE = process.env.API_BASE_URL;

async function proxy(req: Request, path: string[]) {
  const url = new URL(req.url);
  const backendUrl = `${API_BASE}/api/${path.join("/")}${url.search}`;

  // Build headers – forward most headers
  const headers = new Headers(req.headers);
  headers.delete("host");

  // Create a RequestInit with duplex for Node.js fetch
  const init: RequestInit = {
    method: req.method,
    headers,
    // @ts-expect-error - duplex is not in the types for Node.js 18+
    duplex: 'half',
  };

  // Only set body if not GET/HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  const response = await fetch(backendUrl, init);

  const responseHeaders = new Headers(response.headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function PUT(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function DELETE(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}