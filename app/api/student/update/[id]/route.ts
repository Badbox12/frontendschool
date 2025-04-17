// app/api/student/update/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
  const token =(await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = request.nextUrl.pathname.match(/\/student\/update\/(\w+)/)?.groups || {};
  if (!id) 
    return NextResponse.json({ error: 'Missing student ID' }, { status: 400 });

  const data = await request.json();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/student/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
    },})
}