// filepath: apps/web/components/page/Markdown.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders CMS markdown. Raw HTML is not allowed, so editors cannot inject scripts. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-p99">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{children}</ReactMarkdown>
    </div>
  );
}
