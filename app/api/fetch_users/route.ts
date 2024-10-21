import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

// GET request to fetch all user details
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

// PUT request to update user status
export async function PUT(req: Request) {
  try {
    const { detailsid, status } = await req.json();

    // Check if the request body contains both detailsid and status
    if (typeof detailsid !== 'number' || typeof status !== 'boolean') {
      return NextResponse.json({ error: 'Invalid input data.' }, { status: 400 });
    }

    // Update the status in the userDetails table
    const { error } = await supabase
      .from('userDetails')
      .update({ status })
      .eq('detailsid', detailsid);

    if (error) {
      // Handle the error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Status updated successfully.' }, { status: 200 });
    
  } catch (err) {
    // Handle any other errors
    return NextResponse.json({ error: 'An error occurred while updating status.' }, { status: 500 });
  }
}
