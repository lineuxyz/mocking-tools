import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { createMock } from "~/api/CreateMock";
import Link from "next/link";

export default function JsonEditor() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [fontEditorSize, setFontEditorSize] = useState(12);
  const [fontEditorData, setFontEditorData] = useState<string | undefined>("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessCopy, setIsSuccessCopy] = useState(false);
  const [createdMockData, setCreatedMockData] = useState({} as any);

  const isValidJson = (jsonString: string) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${apiUrl}/api/v1/mock/${createdMockData.mockId}`
      );
      setIsSuccessCopy(true);
    } catch (err) {
      console.error("Falha ao copiar o texto: ", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!fontEditorData) return;

      if (isValidJson(fontEditorData)) {
        const mockData = {
          endpoint: "/",
          method: "GET",
          body: JSON.parse(fontEditorData),
        };
        const response = await createMock(mockData);
        setCreatedMockData(response);
        setIsSuccess(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (isSuccessCopy) {
      const successTimeOut = setTimeout(() => {
        setIsSuccessCopy(false);
      }, 3000);

      return () => clearTimeout(successTimeOut);
    }

    return () => {};
  }, [isSuccessCopy]);

  return (
    <>
      <div className="flex justify-between px-16 my-8">
        <Link href="/" className="text-[#101010] text-2xl font-medium">⬅️ Voltar</Link>
      </div>
      <div className="h-full flex justify-between px-16 gap-8 pb-16">
        <div className="drop-shadow-md flex items-center justify-start w-9/12 py-8 px-8  bg-[#fff] rounded-xl">
          <Editor
            height="90vh"
            defaultLanguage="json"
            value={fontEditorData}
            onChange={(value) => {
              setIsError(false);
              setFontEditorData(value);
            }}
            onMount={() => {
              const defaultEditorValue = {
                users: [
                  { id: 1, name: "Alice" },
                  { id: 2, name: "Bob" },
                ],
              };
              setFontEditorData(JSON.stringify(defaultEditorValue));
            }}
            theme="vs-light"
            options={{
              automaticLayout: true,
              formatOnType: true,
              formatOnPaste: true,
              fontSize: fontEditorSize,
            }}
          />
        </div>
        <div className="drop-shadow-md flex flex-col items-start justify-start w-3/12 py-8 px-8 bg-[#fff] rounded-xl gap-4">
          {isSuccess && (
            <div className="flex flex-col w-full bg-[#9DBF9E] text-[#101010] rounded-xl text-white font-medium px-4 py-3">
              Mock criado com sucesso! Use esse link para poder receber seus
              dados:{" "}
              {isSuccessCopy ? (
                <p className="font-medium break-all text-left mt-4">
                  ✅ Copiado com sucesso
                </p>
              ) : (
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-start break-words space-x-2 mt-4 w-full"
                >
                  <p className="font-medium underline break-all text-left">
                    📋 {`${apiUrl}/api/v1/mock/${createdMockData.mockId}`}
                  </p>
                </button>
              )}
            </div>
          )}
          {isError && (
            <div className="flex w-full bg-[#DC143C] rounded-xl text-white font-medium px-4 py-3">
              Erro ao tentar criar seu mock, por favor, tente novamente.
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#8B63FF] rounded-xl text-white font-medium px-4 py-3 hover:bg-[#6749bf] transition"
          >
            Criar meu mock 😊
          </button>
          <div className="w-full flex flex-col">
            <label htmlFor="font-size">Tamanho da fonte</label>
            <input
              value={fontEditorSize}
              onChange={(event) => {
                setFontEditorSize(Number(event.target.value));
              }}
              id="font-size"
              type="number"
              className="w-full bg-[#8B63FF] rounded-xl text-white font-medium px-4 py-3 transition focus:border-[#6749bf]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
