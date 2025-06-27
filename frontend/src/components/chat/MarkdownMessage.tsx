import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownMessageProps {
  content: string | React.ReactNode;
  isRawElement?: boolean;
}

export function MarkdownMessage({ content, isRawElement = false }: MarkdownMessageProps) {
  if (isRawElement && React.isValidElement(content)) {
    return (
      <div className="prose prose-sm max-w-none prose-headings:text-blue-700 prose-strong:text-blue-900 prose-li:marker:text-blue-400 prose-ul:pl-6 prose-pre:bg-gray-100 prose-pre:text-xs prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded-md prose-blockquote:border-blue-300 prose-blockquote:text-blue-800">
        {content}
      </div>
    );
  }
  // Remplacer les \n par de vrais retours à la ligne
  const cleanContent = typeof content === 'string' ? content.replace(/\\n/g, "\n") : '';
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-blue-700 prose-strong:text-blue-900 prose-li:marker:text-blue-400 prose-ul:pl-6 prose-pre:bg-gray-100 prose-pre:text-xs prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded-md prose-blockquote:border-blue-300 prose-blockquote:text-blue-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
    </div>
  );
} 