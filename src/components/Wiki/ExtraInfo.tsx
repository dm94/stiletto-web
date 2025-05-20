import { getMDContent } from "@functions/github";
import { getItemCodedName } from "@functions/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface ExtraInfoProps {
  type: "items" | "creatures";
  name: string;
}

const ExtraInfo: React.FC<ExtraInfoProps> = ({ type, name }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const codedName = getItemCodedName(name);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const text = await getMDContent(type, codedName);
        setContent(text);
      } catch {
        setError(true);
      }
    };
    fetchMarkdown();
  }, [codedName, type]);

  if (error || !content) {
    return false;
  }

  return (
    <div className="w-full p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300 font-medium">
          {t("wiki.extraInfo")}
        </div>
        <div className="p-4 text-neutral-400">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ExtraInfo;
