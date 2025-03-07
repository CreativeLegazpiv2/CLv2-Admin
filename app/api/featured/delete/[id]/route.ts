import { NextResponse } from "next/server"
import { supabase } from "@/services/supabaseClient"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id // Get ID from dynamic route

    if (!id) {
      console.error("❌ Missing id parameter")
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }

    console.log(`Deleting record with id: ${id}`)

    const numericId = Number(id)

    // Retrieve the record
    const { data: recordData, error: fetchError } = await supabase
      .from("event_featured_image")
      .select("*")
      .eq("id", numericId)
      .single()

    if (fetchError) {
      console.error("❌ Error fetching record:", fetchError.message)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!recordData) {
      console.error("❌ Record not found")
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    console.log(`✅ Record found: ${JSON.stringify(recordData)}`)

    // Delete the record
    const { error } = await supabase
      .from("event_featured_image")
      .delete()
      .eq("id", numericId)

    if (error) {
      console.error("❌ Error deleting record:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Record deleted successfully`)

    // Delete image from storage if applicable
    const imageUrl = recordData.image_url
    let fileName = ""

    try {
      if (imageUrl) {
        const urlObj = new URL(imageUrl)
        const parts = urlObj.pathname.split("/")
        fileName = parts.pop() || ""
      }
    } catch (parseError) {
      console.error("❌ Error parsing image URL:", parseError)
    }

    if (fileName) {
      console.log(`Deleting image: ${fileName}`)
      const { error: storageError } = await supabase
        .storage
        .from("featuredImage")
        .remove([fileName])

      if (storageError) {
        console.error("❌ Error deleting image:", storageError.message)
        return NextResponse.json(
          { message: "Record deleted but failed to delete image", error: storageError.message },
          { status: 500 }
        )
      }
      console.log("✅ Image deleted successfully")
    }

    return NextResponse.json({
      message: "Record and associated image deleted successfully"
    })
  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
