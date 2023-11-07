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
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
      <div className="flex justify-between md:px-16 px-4 my-8">
        <Link href="/" className="text-[#101010] text-2xl font-medium">
          ⬅️ Voltar
        </Link>
      </div>
      <div className="h-full flex flex-col md:flex-row justify-between md:px-16 px-4 gap-8 pb-16">
        <div className="drop-shadow-md flex items-center justify-start md:w-9/12 w-12/12 py-8 px-8  bg-[#fff] rounded-xl">
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
        <div className="drop-shadow-md flex flex-col items-start justify-start order-first md:order-2 md:w-3/12 w-12/12 py-8 px-8 bg-[#fff] rounded-xl gap-4">
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
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-[#8B63FF] rounded-xl disabled:bg-[#949494] text-white font-medium px-4 py-3 hover:bg-[#6749bf] transition"
          >
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Criar meu mock 😊"
            )}
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
