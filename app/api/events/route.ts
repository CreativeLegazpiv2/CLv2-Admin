import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const desc = formData.get("desc") as string;
    const image_path = formData.get("image") as File;
    const links = formData.get("links") as string;
    const contact = formData.get('contact') as string;
    const announcement = formData.get('announcement') as string;
    const objective = formData.get('objective') as string;
    const website = formData.get('website') as string;
    
    // Validate required fields
    if (!title || !location || !date || !start_time || !end_time || !desc || !image_path || !links) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Generate the image path based on the current date and filename
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `${currentDate}_${Date.now()}_${image_path.name}`;

    // Upload image to the "admin_events" bucket
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('admin_events')
      .upload(filename, image_path, { cacheControl: '0', upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Construct the public URL for the image
    const imageUrl = supabase
      .storage
      .from('admin_events')
      .getPublicUrl(filename)
      .data.publicUrl;

    // Insert event details, including image URL, into the "admin_events" table
    const { data, error } = await supabase
      .from('admin_events')
      .insert([{ 
        title, 
        location, 
        date, 
        start_time, 
        end_time, 
        desc, 
        image_path: imageUrl, 
        links,
        contact,
        announcement,
        objective,
        website 
      }]); // Use imageUrl instead of image_path

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Respond with success if the insertion was successful
    return NextResponse.json({ message: 'Event created successfully.', data }, { status: 201 });
  } catch (err) {
    console.error('Error creating event:', err); // Log the error for debugging
    return NextResponse.json({ error: 'An error occurred while creating the event.' }, { status: 500 });
  }
}

// fetch data
export async function GET(req: Request) {
    try {
      // Fetch data from the "admin_events" table
      const { data, error } = await supabase
        .from('admin_events')
        .select('*'); // Select all fields; you can specify fields as needed
  
      // Handle any potential errors
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      // Respond with the fetched data
      return NextResponse.json(data || [], { status: 200 });
    } catch (err) {
      console.error('Error fetching events:', err); // Log the error for debugging
      return NextResponse.json({ error: 'An error occurred while fetching events.' }, { status: 500 });
    }
  }

export async function PUT(req: Request) {
    try {
      // Parse the JSON body from the request
      const { id, status } = await req.json();
  
      // Update the "admin_events" table
      const { data, error } = await supabase
        .from('admin_events')
        .update({ status }) // Update status
        .eq('id', id);      // Where id matches
  
      // Handle any potential errors
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      // Respond with the updated data
      return NextResponse.json(data || [], { status: 200 });
    } catch (err) {
      console.error('Error updating events:', err); // Log the error for debugging
      return NextResponse.json({ error: 'An error occurred while updating events.' }, { status: 500 });
    }
  }