"use client";

import { useState } from "react";
import TranslationResult from "./TranslationResult";
import { uploadAndTranslate } from "@/server/common";
import supportedLanguages from "@/supportedLanguages.json";
import useLocalStorage from "use-local-storage";

const UploadForm = () => {
  const [sourceLanguage, setSourceLanguage] = useState<string | null>(null);
  const [documentIds, setDocumentIds] = useLocalStorage<string[] | undefined>("documents", []);

  const handleSubmit = async (data: FormData) => {
    const result = await uploadAndTranslate(data, (data.get("file") as File).name);
    console.log(result);
    if (result.success) {
      setDocumentIds([result.data.operationLocation.split("batches/").pop()!, ...(documentIds ?? [])]);
    }
  };

  return (
    <>
      <form action={handleSubmit} className="flex flex-col items-center w-full gap-8 text-sm md:text-base">
        <div className="w-full rounded-md border-neutral-300 border overflow-hidden bg-white focus-within:border-transparent focus-within:outline focus-within:outline-2">
          <input
            className="relative h-[35px] md:h-[37.5px] w-full focus:outline-none file:rounded-none after:top-0 after:left-[101px] md:after:left-[112px] after:absolute after:bg-neutral-300 after:w-px after:h-full file:border-none file:h-full file:py-1.5 file:px-3 file:mr-4"
            type="file"
            name="file"
            required
          />
        </div>

        <div className="w-full flex flex-col md:flex-row items-center gap-2">
          <div className="w-full rounded-md border-neutral-300 border overflow-hidden pr-2 bg-white focus-within:border-transparent focus-within:outline focus-within:outline-2">
            <select
              id="sourceLanguage"
              className="w-full pl-1 py-2 focus:outline-none"
              name="sourceLanguage"
              defaultValue="detect"
              required
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              <option value="detect">Detect Language</option>
              {supportedLanguages.map(({ language, code }) => (
                <option key={code} value={code}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <svg className="w-8 h-8 rotate-90 md:rotate-0 md:w-16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"></path>
          </svg>

          <div className="w-full rounded-md border-neutral-300 border overflow-hidden pr-2 bg-white focus-within:border-transparent focus-within:outline focus-within:outline-2">
            <select id="targetLanguage" className="w-full pl-1 py-2 focus:outline-none" name="targetLanguage" required defaultValue="">
              <option value="" disabled>
                Choose language
              </option>
              {supportedLanguages.map(({ language, code }) => (
                <option key={code} value={code} disabled={code === sourceLanguage}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          type="submit"
          value="Upload & Translate"
          className="bg-white font-bold hover:bg-neutral-100 transition-colors rounded-md shadow px-3 py-2 border-neutral-300 border focus:outline focus:outline-2 focus:outline-black focus:border-transparent"
        />
      </form>
      <ul className="w-full flex flex-col gap-4">
        {documentIds?.map((id) => (
          <TranslationResult key={id} id={id} remove={() => setDocumentIds((documentIds) => documentIds?.filter((d) => d !== id))} />
        ))}
      </ul>
    </>
  );
};

export default UploadForm;
