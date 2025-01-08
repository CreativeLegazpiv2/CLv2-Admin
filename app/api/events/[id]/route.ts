import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('register_events')
      .select('*')
      .eq('eventID', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}