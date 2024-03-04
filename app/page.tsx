import UploadForm from "./UploadForm";

export default function Home() {
  return (
    <main className="flex flex-col mx-auto items-center justify-center gap-12 max-w-xl w-full">
      <h1 className="text-3xl font-bold">Translate-App</h1>
      <UploadForm />
    </main>
  );
}
