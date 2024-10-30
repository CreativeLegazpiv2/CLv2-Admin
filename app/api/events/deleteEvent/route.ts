import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function DELETE(req: Request) {
    try {
      // Parse the request body to get the ID
      const { id } = await req.json();

      // Delete the record with the matching ID
      const { data, error } = await supabase
        .from('admin_events')
        .delete()
        .eq('id', id);

      // Handle any potential errors
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Respond with a success message
      return NextResponse.json({ message: 'Event deleted successfully', data }, { status: 200 });
    } catch (err) {
      console.error('Error deleting event:', err); // Log the error for debugging
      return NextResponse.json({ error: 'An error occurred while deleting the event.' }, { status: 500 });
    }
}
