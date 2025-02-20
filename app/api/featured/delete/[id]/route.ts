import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function DELETE(req: Request) {
  try {
    // Extract the id from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    // Retrieve the record to get the image URL
    const { data: recordData, error: fetchError } = await supabase
      .from('event_featured_image')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }
    if (!recordData) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    // Delete the record from the table
    const { data, error } = await supabase
      .from('event_featured_image')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Parse the file name from the stored image URL.
    // Assuming the image_url is in the format:
    // https://<your-project-ref>.supabase.co/storage/v1/object/public/featuredImage/<fileName>
    const imageUrl = recordData.image_url;
    let fileName = '';
    try {
      const urlObj = new URL(imageUrl);
      const parts = urlObj.pathname.split('/');
      fileName = parts.pop() || '';
    } catch (parseError) {
      console.error('Error parsing image URL:', parseError);
    }

    // If we got a file name, delete the image from the 'featuredImage' bucket.
    if (fileName) {
      const { error: storageError } = await supabase
        .storage
        .from('featuredImage')
        .remove([fileName]);

      if (storageError) {
        // Record deletion was successful but image deletion failed.
        return NextResponse.json(
          { message: 'Record deleted but failed to delete image', error: storageError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: 'Record and associated image deleted successfully'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
