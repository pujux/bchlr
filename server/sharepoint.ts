"use server";

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

const siteId = process.env.SHAREPOINT_SITE_ID;
const folderId = process.env.SHAREPOINT_FOLDER_ID;

if (!clientId || !clientSecret || !tenantId || !siteId || !folderId) {
  throw new Error("Missing environment variables! Make sure all are set!");
}

export async function getAccessToken() {
  try {
    const params = new FormData();
    params.append("client_id", clientId!);
    params.append("scope", "https://graph.microsoft.com/.default");
    params.append("client_secret", clientSecret!);
    params.append("grant_type", "client_credentials");

    const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();
    return { success: true as const, data: { accessToken: data.access_token as string } };
  } catch (e: any) {
    console.error("Error in getAccessToken: " + e.message);
    return { success: false as const, data: e.message as string };
  }
}

export async function queryFiles(accessToken: string) {
  try {
    const response = await fetch(`https://{site_url}/_api/web/GetFolderByServerRelativeUrl('$${folderId}')/Files`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) => res.json());

    return { success: true as const, data: { files: response.value as any[] } };
  } catch (e: any) {
    console.error("Error in queryFiles: " + e.message);
    return { success: false as const, data: e.message as string };
  }
}
