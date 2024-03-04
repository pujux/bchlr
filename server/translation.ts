"use server";

const translatorEndpoint = process.env.TRANSLATOR_ENDPOINT + "translator/text/batch/v1.1/batches";
const translatorKey = process.env.TRANSLATOR_KEY;
const storageContainerName = process.env.STORAGE_CONTAINER_NAME;

export async function translateDocument(fileName: string, sourceLanguage: string, targetLanguage: string) {
  const data = {
    inputs: [
      {
        storageType: "File",
        source: {
          sourceUrl: `https://${storageContainerName}.blob.core.windows.net/input/${fileName}`,
          language: sourceLanguage === "detect" ? undefined : sourceLanguage,
        },
        targets: [
          {
            targetUrl: `https://${storageContainerName}.blob.core.windows.net/output/${targetLanguage}-${fileName}`,
            language: targetLanguage,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(translatorEndpoint, {
      method: "POST",
      headers: [
        ["Ocp-Apim-Subscription-Key", translatorKey!],
        ["Content-Type", "application/json"],
      ],
      body: JSON.stringify(data),
    });

    if (response.status !== 202) {
      const res = await response.json();
      throw new Error(`[HTTP/${response.status}] ${res.error.code} - ${res.error.message}`);
    }

    const operationLocation = response.headers.get("operation-location")!;
    return { success: true as const, data: { operationLocation } };
  } catch (e: any) {
    console.error("Error in translateDocument: " + e.message);
    return { success: false as const, data: e.message as string };
  }
}

export interface DocumentStatus {
  path: string;
  sourcePath: string;
  createdDateTimeUtc: string;
  lastActionDateTimeUtc: string;
  status: string;
  to: string;
  progress: number;
  id: string;
  characterCharged: number;
}

export async function getTranslationStatus(id: string) {
  try {
    const response = await fetch(`${translatorEndpoint}/${id}/documents`, {
      method: "GET",
      headers: [["Ocp-Apim-Subscription-Key", translatorKey!]],
    });
    const res = await response.json();

    if (response.status !== 200) {
      throw new Error(`[HTTP/${response.status}] ${res.error.code} - ${res.error.message}`);
    }

    if (!res.value.length) {
      throw new Error("No documents found");
    }

    return { success: true as const, data: { document: res.value[0] as DocumentStatus } };
  } catch (e: any) {
    console.error("Error in getTranslationStatus: " + e.message);
    return { success: false as const, data: e.message as string };
  }
}
