"use server";

import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.STORAGE_CONTAINER_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Missing environment variables! Make sure all are set!");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString!);
const inputContainerClient = blobServiceClient.getContainerClient("input");
const outputContainerClient = blobServiceClient.getContainerClient("output");

export async function uploadFile(fileName: string, fileData: Buffer) {
  try {
    const blockBlobClient = inputContainerClient.getBlockBlobClient(fileName);
    const uploadResult = await blockBlobClient.uploadData(fileData);

    if (!uploadResult.requestId) {
      throw new Error("No requestId returned");
    }

    return { success: true as const, data: { requestId: uploadResult.requestId } };
  } catch (e: any) {
    console.error("Error in uploadFile: " + e.message);
    return { success: false as const, data: e.message as string };
  }
}

export async function downloadFile(blobName: string) {
  const blockBlobClient = outputContainerClient.getBlockBlobClient(blobName);

  try {
    const blobResponse = await blockBlobClient.download();
    return blobResponse.readableStreamBody;
  } catch (e: any) {
    console.error("Error in downloadFile: ", e.message);
    throw e;
  }
}
