"use client";

import { useRef, useState } from "react";
import TranslationResult from "./TranslationResult";
import { uploadAndTranslate } from "@/server/common";
import supportedLanguages from "@/supportedLanguages.json";
import useLocalStorage from "use-local-storage";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const UploadForm = () => {
  const [documentIds, setDocumentIds] = useLocalStorage<string[] | undefined>(
    "documents",
    []
  );

  const [fileName, setFileName] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await uploadAndTranslate(
      formData,
      (formData.get("file") as File).name
    );
    console.log(result);
    if (result.success) {
      setDocumentIds([
        result.data.operationLocation.split("batches/").pop()!,
        ...(documentIds ?? []),
      ]);
      setFileName(""); // Reset file name after successful upload
    }
  };

  return (
    <div className="items-center min-h-screen px-8 py-16 justify-center">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
          <img
            src="/Logo.svg"
            alt="Beschreibung des Bildes"
            className="mx-auto"
          />
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div
              className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer relative"
              onClick={handleDivClick}
            >
              <UploadFileIcon className="h-12 w-12 mx-auto text-gray-400" />
              <label
                htmlFor="file-upload"
                className="mt-2 text-sm text-gray-600 cursor-pointer"
              >
                Drag and Drop or select to upload
              </label>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                name="file"
                required
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {fileName && (
                <p className="text-sm text-gray-600 mt-2">{fileName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Translate from
              </label>
              <select
                name="sourceLanguage"
                className="block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue="detect"
                required
              >
                <option value="detect">Input</option>
                {supportedLanguages.map(({ language, code }) => (
                  <option key={code} value={code}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                into
              </label>
              <select
                name="targetLanguage"
                className="block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Output
                </option>
                {supportedLanguages.map(({ language, code }) => (
                  <option key={code} value={code}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="mt-8 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              UPLOAD & TRANSLATE
            </button>
          </form>
          <ul className="w-full flex flex-col gap-4">
            {documentIds?.map((id) => (
              <TranslationResult
                key={id}
                id={id}
                remove={() =>
                  setDocumentIds((documentIds) =>
                    documentIds?.filter((d) => d !== id)
                  )
                }
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
