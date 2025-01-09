// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const supabase = createClient();
//   const data = await req.json();
//   const { file, fileName } = data;
// console.log("ssssssssssssssssssssssssssssssssssssssss555555", fileName);
//   try {
//     // Decode the base64 file data
//     const base64Data = file.split(",")[1];
//     const buffer = Buffer.from(base64Data, "base64");

//     // Upload the file to Supabase storage
//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from("images") // Replace with your Supabase storage bucket name
//       .upload(`uploads/${fileName}`, buffer, {
//         contentType: "image/jpeg", // Replace with the correct content type
//         upsert: true, // If you want to overwrite existing files
//       });

//     if (uploadError) {
//       throw new Error(`Supabase upload error: ${uploadError.message}`);
//     }

//     // Generate a public URL for the uploaded file
//     const { data: publicURLData } = supabase.storage
//       .from("your-bucket-name")
//       .getPublicUrl(`uploads/${fileName}`);

//     return NextResponse.json({
//       message: "File uploaded successfully!",
//       url: publicURLData.publicUrl,
//     });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return NextResponse.json(
//       { error: "Failed to upload file to Supabase storage" },
//       { status: 500 }
//     );
//   }
// }
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const data = await req.json();
  const { file, fileName } = data;

  try {
    // Extract the base64 data (remove the data:image/png;base64, prefix)
    const base64Data = file.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a unique filename using timestamp
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(`uploads/${uniqueFileName}`, buffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: publicURLData } = supabase.storage
      .from('images')
      .getPublicUrl(`uploads/${uniqueFileName}`);

    return NextResponse.json({
      success: true,
      url: publicURLData.publicUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}