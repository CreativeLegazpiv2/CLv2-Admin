import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const title = formData.get('title');
    const image = formData.get('image');

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Missing required fields: title and image' },
        { status: 400 }
      );
    }

    // Type cast the image to a File
    const file = image as File;
    
    // Generate a unique filename for the uploaded image
    const fileName = `${Date.now()}-${file.name}`;
    
    // Upload the image to the 'featuredImage' bucket
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('featuredImage')
      .upload(fileName, file);
      
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }
    
    // Retrieve the public URL for the uploaded image
    const { data: publicUrlData } = supabase
      .storage
      .from('featuredImage')
      .getPublicUrl(fileName);
      
    const image_url = publicUrlData.publicUrl;
    
    // Insert a record into the 'event_featured_image' table
    const { data, error } = await supabase
      .from('event_featured_image')
      .insert([{ title, image_url }]);
      
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Image uploaded and record created successfully',
      data
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
