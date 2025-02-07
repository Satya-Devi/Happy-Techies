import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const data = await req.json();
  const { file, fileName } = data;

  try {
    // Validate file format (only accept PDFs and DOCX files)
    const allowedExtensions = [".pdf", ".docx"];
    const fileExtension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: "Only PDF and DOCX files are allowed" },
        { status: 400 }
      );
    }

    // Extract the base64 data (remove the appropriate prefix)
    const base64Data = file.split(";base64,").pop();
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename using timestamp
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Upload the file to the 'CVs' folder in Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(`uploads/${uniqueFileName}`, buffer, {
        contentType: fileExtension === ".pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: publicURLData } = supabase.storage
      .from("cvs")
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
