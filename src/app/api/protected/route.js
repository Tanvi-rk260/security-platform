import { verifyToken } from '@/app/utils/auth';

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = verifyToken(token);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 403 });

  return Response.json({ message: 'Secure data accessed', user });
}

