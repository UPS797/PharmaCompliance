// Simple script to check the Notion URL format and extract the page ID
const notionPageUrl = process.env.NOTION_PAGE_URL;

console.log("Notion Page URL:", notionPageUrl);

// Try different regex patterns for extraction
console.log("\nTrying different extraction methods:");

// Method 1: Standard 32-character ID
const pattern1 = /([a-f0-9]{32})(?:[?#]|$)/i;
const match1 = notionPageUrl.match(pattern1);
console.log("Method 1 (32-char hex):", match1 ? match1[1] : "No match");

// Method 2: Extract from notion.so URL format
const pattern2 = /notion\.so\/(?:[^/]+\/)?([a-zA-Z0-9]+)/;
const match2 = notionPageUrl.match(pattern2);
console.log("Method 2 (notion.so path):", match2 ? match2[1] : "No match");

// Method 3: Extract after last hyphen or slash
const pattern3 = /([^-/]+)(?:[?#]|$)/;
const match3 = notionPageUrl.match(pattern3);
console.log("Method 3 (after last separator):", match3 ? match3[1] : "No match");

// Check if there are hyphens that need to be removed
if (notionPageUrl.includes("-")) {
  console.log("\nURL contains hyphens, which might need to be removed from the ID");
  const withoutHyphens = notionPageUrl.replace(/-/g, "");
  console.log("URL with hyphens removed:", withoutHyphens);
  
  const pattern4 = /([a-f0-9]{32})(?:[?#]|$)/i;
  const match4 = withoutHyphens.match(pattern4);
  console.log("Method 4 (after hyphen removal):", match4 ? match4[1] : "No match");
}