"use server";

import { uploadFile } from "./blob-storage";
import { translateDocument } from "./translation";
import supportedLanguages from "@/supportedLanguages.json";

export async function uploadAndTranslate(data: FormData, fileName: string) {
  try {
    const file = data.get("file") as File | null;
    const sourceLanguage = data.get("sourceLanguage") as string | null;
    const targetLanguage = data.get("targetLanguage") as string | null;

    if (!file) {
      throw new Error("No file uploaded");
    }

    if (!sourceLanguage || (sourceLanguage !== "detect" && supportedLanguages.some(({ code }) => code === sourceLanguage))) {
      throw new Error(`No valid source language provided: ${sourceLanguage}`);
    }

    if (!targetLanguage || !supportedLanguages.some(({ code }) => code === targetLanguage)) {
      throw new Error(`No valid target language provided: ${targetLanguage}`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadFile(fileName, buffer);

    if (uploadResult.success) {
      return await translateDocument(fileName, sourceLanguage, targetLanguage);
    } else {
      return uploadResult;
    }
  } catch (e: any) {
    console.error("Error in uploadAndTranslate: " + e.message);
    return { success: false as const, data: e.message as string };
  }
}
