import { Tool } from "@raycast/api";
import { parseStringPromise } from "xml2js";
import fetch from "node-fetch";

// Define the WordPress REST API endpoint
const WP_API_BASE = "https://stadt-bremerhaven.de/wp-json/wp/v2";

interface SearchParams {
  author?: string;
  search?: string;
  categories?: string;
  tags?: string;
  before?: string; // Format: YYYY-MM-DDThh:mm:ss (ISO 8601)
  after?: string;  // Format: YYYY-MM-DDThh:mm:ss (ISO 8601)
  slug?: string;
  per_page?: number;
}

interface SearchResult {
  id: number;
  date: string;
  title: { rendered: string };
  link: string;
  excerpt: { rendered: string };
  author: number;
  author_name?: string;
}

export default async function SearchBlog(
  query: string
): Promise<{ results: { title: string; url: string; snippet: string }[] }> {
  try {
    // Parse the natural language query to extract search parameters
    const searchParams = parseQuery(query);
    
    // Construct the WordPress API URL
    const apiUrl = constructApiUrl(searchParams);
    
    // Fetch results from WordPress API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const results = await response.json() as SearchResult[];
    
    // If we have author IDs, fetch author names
    if (results.length > 0) {
      await enrichWithAuthorNames(results);
    }
    
    // Format the results for the AI
    return {
      results: results.map((result) => ({
        title: stripHtmlTags(result.title.rendered),
        url: result.link,
        snippet: formatSnippet(result),
      })),
    };
  } catch (error) {
    console.error("Error searching blog:", error);
    return { results: [] };
  }
}

// Parse the natural language query into search parameters
function parseQuery(query: string): SearchParams {
  const params: SearchParams = {
    per_page: 10, // Default to 10 results
  };
  
  // Extract date ranges
  const dateRegex = /(?:from|after|since)\s+(\d{4}-\d{1,2}-\d{1,2})|(?:before|until)\s+(\d{4}-\d{1,2}-\d{1,2})|(?:on|at)\s+(\d{4}-\d{1,2}-\d{1,2})/gi;
  const dateMatches = [...query.matchAll(dateRegex)];
  
  dateMatches.forEach((match) => {
    const afterDate = match[1];
    const beforeDate = match[2];
    const onDate = match[3];
    
    if (afterDate) {
      params.after = formatDate(afterDate);
    }
    if (beforeDate) {
      params.before = formatDate(beforeDate);
    }
    if (onDate) {
      const date = formatDate(onDate);
      params.after = date;
      // Set before date to the end of the same day
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      params.before = nextDay.toISOString();
    }
  });
  
  // Extract author
  const authorRegex = /(?:by|author|from)\s+([a-zA-ZäöüÄÖÜß]+(?:\s+[a-zA-ZäöüÄÖÜß]+)?)/i;
  const authorMatch = query.match(authorRegex);
  if (authorMatch && authorMatch[1]) {
    params.author = authorMatch[1];
  }
  
  // Extract categories or tags
  const categoryRegex = /(?:category|in|about)\s+([a-zA-ZäöüÄÖÜß]+(?:\s+[a-zA-ZäöüÄÖÜß]+)?)/i;
  const categoryMatch = query.match(categoryRegex);
  if (categoryMatch && categoryMatch[1]) {
    params.categories = categoryMatch[1];
  }
  
  // Extract search terms (everything else)
  // Remove the parts we've already processed
  let searchTerms = query
    .replace(dateRegex, "")
    .replace(authorRegex, "")
    .replace(categoryRegex, "")
    .replace(/(?:search for|find|show me|get|articles about|posts about)/gi, "")
    .trim();
  
  if (searchTerms) {
    params.search = searchTerms;
  }
  
  return params;
}

// Format date string to ISO 8601
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString();
}

// Construct the WordPress API URL with search parameters
function constructApiUrl(params: SearchParams): string {
  const url = new URL(`${WP_API_BASE}/posts`);
  
  if (params.search) {
    url.searchParams.append("search", params.search);
  }
  
  if (params.before) {
    url.searchParams.append("before", params.before);
  }
  
  if (params.after) {
    url.searchParams.append("after", params.after);
  }
  
  if (params.per_page) {
    url.searchParams.append("per_page", params.per_page.toString());
  }
  
  // For author, categories, and tags, we need to handle them specially
  // as they might be names rather than IDs
  if (params.author) {
    // We'll handle author name to ID conversion in a separate function
    // For now, just add it as a search parameter
    url.searchParams.append("search", params.author);
  }
  
  if (params.categories) {
    // Same for categories
    url.searchParams.append("search", params.categories);
  }
  
  if (params.tags) {
    // Same for tags
    url.searchParams.append("search", params.tags);
  }
  
  return url.toString();
}

// Enrich results with author names
async function enrichWithAuthorNames(results: SearchResult[]): Promise<void> {
  const authorIds = [...new Set(results.map(r => r.author))];
  
  for (const authorId of authorIds) {
    try {
      const response = await fetch(`${WP_API_BASE}/users/${authorId}`);
      if (response.ok) {
        const authorData = await response.json();
        const authorName = authorData.name;
        
        // Add author name to all matching results
        results.forEach(result => {
          if (result.author === authorId) {
            result.author_name = authorName;
          }
        });
      }
    } catch (error) {
      console.error(`Error fetching author data for ID ${authorId}:`, error);
    }
  }
}

// Format the snippet with date, author, and excerpt
function formatSnippet(result: SearchResult): string {
  const date = new Date(result.date).toLocaleDateString("de-DE");
  const author = result.author_name || "Unknown author";
  const excerpt = stripHtmlTags(result.excerpt.rendered).substring(0, 150) + "...";
  
  return `${date} | ${author} | ${excerpt}`;
}

// Helper function to strip HTML tags
function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
} 