import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const formData = await req.formData();
    
    const updateData = {
      title: formData.get('title'),
      location: formData.get('location'),
      date: formData.get('date'),
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time'),
      desc: formData.get('desc'),
    };

    // Handle image update if provided
    const image = formData.get('image_path');
    if (image instanceof File) {
      // You'll need to implement image upload logic here
      // and add the resulting URL to updateData
    }

    const { data, error } = await supabase
      .from('admin_events')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (err) {
    console.error('Error updating event:', err);
    return NextResponse.json({ error: 'An error occurred while updating the event.' }, { status: 500 });
  }
}