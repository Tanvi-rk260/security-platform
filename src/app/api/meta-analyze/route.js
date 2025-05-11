import { fetchAndParseMeta } from '@/lib/fetchMeta';

export async function POST(request) {
  const { url } = await request.json();

  try {
    const meta = await fetchAndParseMeta(url);
    return Response.json({ meta });
  } catch (err) {
    return Response.json({ meta: [], error: 'Failed to fetch site.' }, { status: 500 });
  }
}
