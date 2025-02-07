import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const data = await req.json();
  const { file, fileName } = data;

  try {
    // Validate file format (only accept PDFs)
    if (!fileName.endsWith(".pdf")) {
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Extract the base64 data (remove the data:application/pdf;base64, prefix)
    const base64Data = file.split(";base64,").pop();
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename using timestamp
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Upload the file to the 'Resumes' folder in Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(`uploads/${uniqueFileName}`, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: publicURLData } = supabase.storage
      .from("resumes")
      .getPublicUrl(`uploads/${uniqueFileName}`);

    return NextResponse.json({
      success: true,
      url: publicURLData.publicUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
