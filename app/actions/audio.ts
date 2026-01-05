"use server";

import { fileTypeFromBuffer } from "file-type";
import { uploadFile } from "@/lib/storage";

export async function validateAudio(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, message: "No file provided" };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const type = await fileTypeFromBuffer(buffer);

  if (!type) {
    return { success: false, message: "Could not determine file type" };
  }

  const allowedExtensions = ["mp3", "wav", "m4a"];

  if (!allowedExtensions.includes(type.ext)) {
    return {
      success: false,
      message: `Invalid audio format. Allowed: ${allowedExtensions.join(", ")}. Detected: ${type.ext}`,
    };
  }

  try {
    const uploadUrl = await uploadFile(buffer, file.name, file.type);
    return { success: true, message: "Valid audio file uploaded successfully", type: type.ext, url: uploadUrl };
  } catch (error) {
    console.error("Upload failed", error);
    return { success: false, message: "Validation successful but upload failed" };
  }
}
