import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) 
    return NextResponse.json({ error: 'Missing student ID' }, { status: 400 });

  const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/student`);
  apiUrl.searchParams.append('id', id);
  const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      ...Object.fromEntries(res.headers.entries()),
    },
  });
}