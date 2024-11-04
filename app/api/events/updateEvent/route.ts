import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function PUT(req: Request) {
  try {
    // Create a FormData object from the request
    const formData = await req.formData();

    // Extract fields from FormData
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const date = formData.get('date') as string;
    const start_time = formData.get('start_time') as string;
    const end_time = formData.get('end_time') as string;
    const desc = formData.get('desc') as string;
    const image_path = formData.get("image") as File;

    // Validate required fields
    if (!id || !title || !location || !date || !start_time || !end_time || !desc) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    let imageUrl = null;

    // Fetch the existing image URL before uploading the new image
    let existingImagePath = null;
    if (image_path) { 
      // Validate the MIME type
      if (image_path.type !== 'image/jpeg') {
        return NextResponse.json({ error: 'Invalid image type. Only JPEG images are allowed.' }, { status: 400 });
      }

      // Retrieve existing image path from the database
      const { data: currentData, error: fetchError } = await supabase
        .from('admin_events')
        .select('image_path')
        .eq('id', id)
        .single();

      if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
      }
      
      existingImagePath = currentData?.image_path || null; // Save the current image path

      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `${currentDate}_${Date.now()}_${image_path.name}`;

      // Upload image to the "admin_events" bucket
      const { error: uploadError } = await supabase
        .storage
        .from('admin_events')
        .upload(filename, image_path, { cacheControl: '0', upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
      }

      // Construct the public URL for the new image
      const { data: publicURLData } = supabase
        .storage
        .from('admin_events')
        .getPublicUrl(filename);

      imageUrl = publicURLData?.publicUrl || null; // Ensure imageUrl is assigned correctly

      // Delete the existing image from Supabase storage if it exists
      if (existingImagePath) {
        const { error: deleteError } = await supabase
          .storage
          .from('admin_events')
          .remove([existingImagePath.split('/').pop()]); // Use just the filename

        if (deleteError) {
          console.error(`Failed to delete existing image: ${deleteError.message}`);
          // You might want to handle this error, but continue with the update
        }
      }
    } else {
      // If no new image is uploaded, retrieve the existing image URL
      const { data: currentData, error: fetchError } = await supabase
        .from('admin_events')
        .select('image_path')
        .eq('id', id)
        .single();

      if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
      }
      imageUrl = currentData?.image_path || null; // Retain the current image if available
    }

    // Prepare update data
    const updateData = {
      title,
      location,
      date,
      start_time,
      end_time,
      desc,
      image_path: imageUrl, // Use the new image URL or existing one
    };

    // Update the "admin_events" table
    const { data, error } = await supabase
      .from('admin_events')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Respond with the updated data
    return NextResponse.json({ message: 'Event updated successfully.', data }, { status: 200 });
  } catch (err) {
    console.error('Error updating event:', err);
    return NextResponse.json({ error: 'An error occurred while updating the event.' }, { status: 500 });
  }
}
