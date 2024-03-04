"use client";

import { DocumentStatus, getTranslationStatus } from "@/server/translation";
import { useCallback, useEffect, useState } from "react";
import supportedLanguages from "@/supportedLanguages.json";

const TranslationResult = ({ id, remove }: { id: string; remove: () => void }) => {
  const [data, setData] = useState<DocumentStatus | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const handleDownload = async () => {
    if (!data) return;
    const fileName = data.path.split("/").pop()!;
    const response = await fetch(`/api/download?blob=${fileName}`).then((res) => res.blob());
    const url = window.URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const refresh = useCallback(() => {
    setIsReloading(true);
    getTranslationStatus(id).then((result) => {
      if (result.success) {
        setData(result.data.document);
      } else {
        console.error(`Error loading document (${id}): ${result.data}`);
      }
      setIsReloading(false);
    });
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(refresh, 2500);
    return () => clearTimeout(timeout);
  }, [refresh]);

  if (!data) return null;

  const language = supportedLanguages.find(({ code }) => code.toLowerCase() === data.to.toLowerCase())?.language;
  const timeTaken = Math.floor((Date.parse(data.lastActionDateTimeUtc) - Date.parse(data.createdDateTimeUtc)) / 1e3);

  return (
    <li className="flex-grow p-4 bg-white rounded-md shadow">
      <div className="mx-auto flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          <p className="text-sm md:text-base font-bold overflow-hidden overflow-ellipsis">{decodeURIComponent(data.sourcePath.split("/").pop()!)}</p>
          {data.status !== "Succeeded" ? (
            <div className="cursor-pointer" onClick={refresh}>
              <svg className="w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6c0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8m0 14c-3.31 0-6-2.69-6-6c0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4l-4-4z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="cursor-pointer" onClick={remove}>
              <svg className="w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z"
                ></path>
              </svg>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center flex-wrap gap-2 text-xs md:text-sm">
          {data.status === "Succeeded" ? (
            <>
              <button className="cursor-pointer underline underline-offset-1" onClick={handleDownload}>
                Download in {language}
              </button>
              <p className="opacity-65">
                Translated {data.characterCharged} characters in ~{timeTaken} seconds
              </p>
            </>
          ) : (
            <p>Job is still running, reload in a few seconds...</p>
          )}
        </div>
      </div>
    </li>
  );
};

export default TranslationResult;
