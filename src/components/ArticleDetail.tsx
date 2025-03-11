import { Detail, ActionPanel, Action, Icon, Color } from "@raycast/api";
import { Article, formatDate, stripHtml } from "../utils";

interface ArticleDetailProps {
  article: Article;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
  // Create markdown for detail view
  const markdown = `
# ${article.title}

${article.creator ? `By **${article.creator}** • ` : ""}${formatDate(article.pubDate)}

${article.categories && article.categories.length > 0 
  ? `**Categories:** ${article.categories.join(", ")}\n\n` 
  : ""}

${stripHtml(article.content || article.description)}
  `;

  return (
    <Detail
      markdown={markdown}
      navigationTitle={article.title}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Author" text={article.creator || "Unknown"} />
          <Detail.Metadata.Label title="Published" text={formatDate(article.pubDate)} />
          {article.categories && article.categories.length > 0 && (
            <Detail.Metadata.TagList title="Categories">
              {article.categories.map((category, index) => (
                <Detail.Metadata.TagList.Item
                  key={index}
                  text={category}
                  color={Color.Blue}
                />
              ))}
            </Detail.Metadata.TagList>
          )}
          <Detail.Metadata.Link
            title="Article URL"
            target={article.link}
            text="Open on Caschys Blog"
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={article.link} title="Open in Browser" />
          <Action.CopyToClipboard
            title="Copy Link"
            content={article.link}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
          <Action.CopyToClipboard
            title="Copy Title"
            content={article.title}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        </ActionPanel>
      }
    />
  );
} 