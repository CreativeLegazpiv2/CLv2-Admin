import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(req: Request) {
  try {
    // Fetch all data from the userDetails table
    const { data, error } = await supabase
      .from('userDetails')
      .select('*'); 

    if (error) {
      // Handle the error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the fetched data
    return NextResponse.json({ data }, { status: 200 });

  } catch (err) {
    // Handle any other errors
    return NextResponse.json({ error: 'An error occurred while fetching data.' }, { status: 500 });
  }
}
