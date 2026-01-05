import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const B2_ENDPOINT = process.env.B2_ENDPOINT || "";
const B2_KEY_ID = process.env.B2_KEY_ID || "";
const B2_APP_KEY = process.env.B2_APP_KEY || "";
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME || "";
const B2_REGION = process.env.B2_REGION || "us-east-005"; // Default fallback

if (!B2_ENDPOINT || !B2_KEY_ID || !B2_APP_KEY || !B2_BUCKET_NAME) {
  console.warn("Missing Backblaze B2 environment variables.");
}

const s3Client = new S3Client({
  endpoint: B2_ENDPOINT,
  region: B2_REGION,
  credentials: {
    accessKeyId: B2_KEY_ID,
    secretAccessKey: B2_APP_KEY,
  },
});

export async function uploadFile(
  fileBuffer: Uint8Array,
  fileName: string,
  contentType: string
): Promise<string> {
  // Sanitize filename to avoid path issues
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Construct the public URL (assuming the bucket is public or you have a way to generate presigned URLs if private)
    // For B2, usually it is https://<bucketName>.<s3-endpoint>/<key> or similar depending on configuration.
    // However, if using S3 API, the public URL might need to be constructed manually.
    // A common pattern for B2 friendly URLs: https://f000.backblazeb2.com/file/<bucket_name>/<key>
    // But since the user gave an endpoint like s3.us-west-001.backblazeb2.com, we can try to guess or just return the key.
    // Let's rely on standard S3 style URL if possible or just return a message if we can't guess.
    
    // NOTE: B2 friendly URL is different from S3 endpoint. 
    // IF the endpoint is "https://s3.us-west-001.backblazeb2.com", the file URL is roughly "https://<bucket>.s3.us-west-001.backblazeb2.com/<key>"
    // OR if using the friendly URL structure: "https://f00X.backblazeb2.com/file/<bucketName>/<key>"
    
    // For now, let's construct a standard S3-style URL based on the endpoint provided.
    const url = `${B2_ENDPOINT}/${B2_BUCKET_NAME}/${uniqueFileName}`;
    
    return url;
  } catch (error) {
    console.error("Error uploading file to B2:", error);
    throw new Error("Failed to upload file");
  }
}
