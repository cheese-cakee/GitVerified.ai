import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to a public/uploads directory for now so we can access it
    // In production, this should go to S3 or a shared volume
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    console.log(`Uploaded file to ${filePath}`);

    return NextResponse.json({ 
      success: true, 
      path: `/uploads/${file.name}`,
      filename: file.name
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
