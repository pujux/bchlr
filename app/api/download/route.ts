import { downloadFile } from "@/server/blob-storage";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const blob = searchParams.get("blob");

  if (!blob) {
    return new NextResponse(null);
  }

  const stream = await downloadFile(blob);

  if (!stream) {
    return new NextResponse(null);
  }

  const headers = new Headers();
  headers.append("Content-Disposition", `attachment; filename="${decodeURIComponent(blob)}"`);
  headers.append("Content-Type", "application/pdf");

  return new NextResponse(stream as unknown as BodyInit, { headers });
}
