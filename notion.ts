import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
    // Extract the ID from a Notion URL
    // Format can be either notion.so/[workspace]/[page-title]-[ID]
    // or notion.so/[ID] or notion.so/[workspace]/[ID]
    
    // Try to match the ID pattern (32 hex characters)
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    // If we can't find the ID in the URL, use the hardcoded ID
    // This is a fallback for when the URL format is different
    return "1fe8b0869f9e81d3b478000c5d372068";
}

export const NOTION_PAGE_ID = process.env.NOTION_PAGE_URL ? extractPageIdFromUrl(process.env.NOTION_PAGE_URL) : "";

/**
 * Lists all child databases contained within NOTION_PAGE_ID
 * @returns {Promise<Array<{id: string, title: string}>>} - Array of database objects with id and title
 */
export async function getNotionDatabases() {
    if (!NOTION_PAGE_ID) {
        throw new Error("NOTION_PAGE_ID is not defined. Please set NOTION_PAGE_URL environment variable.");
    }

    // Array to store the child databases
    const childDatabases = [];

    try {
        // Query all child blocks in the specified page
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: NOTION_PAGE_ID,
                start_cursor: startCursor,
            });

            // Process the results
            for (const block of response.results) {
                // Check if the block is a child database
                if ('type' in block && block.type === "child_database") {
                    const databaseId = block.id;

                    // Retrieve the database title
                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: databaseId,
                        });

                        // Add the database to our list
                        childDatabases.push(databaseInfo);
                    } catch (error) {
                        console.error(`Error retrieving database ${databaseId}:`, error);
                    }
                }
            }

            // Check if there are more results to fetch
            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        return childDatabases;
    } catch (error) {
        console.error("Error listing child databases:", error);
        throw error;
    }
}

// Find a Notion database with the matching title
export async function findDatabaseByTitle(title: string) {
    if (!NOTION_PAGE_ID) {
        throw new Error("NOTION_PAGE_ID is not defined. Please set NOTION_PAGE_URL environment variable.");
    }
    
    const databases = await getNotionDatabases();

    for (const db of databases) {
        // Check if the database has a title property
        if ('title' in db && db.title) {
            // Extract the plain text from the title
            let dbTitle = "";
            
            // Handle array of rich text objects
            if (Array.isArray(db.title)) {
                // Extract text content from each rich text object
                dbTitle = db.title
                    .map((titlePart: any) => titlePart.plain_text || "")
                    .join("")
                    .toLowerCase();
            } 
            // Handle object with rich_text property
            else if (db.title.rich_text && Array.isArray(db.title.rich_text)) {
                dbTitle = db.title.rich_text
                    .map((richText: any) => richText.plain_text || "")
                    .join("")
                    .toLowerCase();
            }
            
            if (dbTitle === title.toLowerCase()) {
                return db;
            }
        }
    }

    return null;
}

// Create a new database if one with a matching title does not exist
export async function createDatabaseIfNotExists(title: string, properties: any) {
    if (!NOTION_PAGE_ID) {
        throw new Error("NOTION_PAGE_ID is not defined. Please set NOTION_PAGE_URL environment variable.");
    }
    
    const existingDb = await findDatabaseByTitle(title);
    if (existingDb) {
        return existingDb;
    }
    
    return await notion.databases.create({
        parent: {
            type: "page_id",
            page_id: NOTION_PAGE_ID
        },
        title: [
            {
                type: "text",
                text: {
                    content: title
                }
            }
        ],
        properties
    });
}

// Get all tasks from the Notion database
export async function getTasks(tasksDatabaseId: string) {
    try {
        const response = await notion.databases.query({
            database_id: tasksDatabaseId,
        });

        return response.results.map((page: any) => {
            const properties = page.properties;

            const dueDate = properties.DueDate?.date?.start
                ? new Date(properties.DueDate.date.start).toISOString()
                : null;

            const completedAt = properties.CompletedAt?.date?.start
                ? new Date(properties.CompletedAt.date.start).toISOString()
                : null;

            return {
                notionId: page.id,
                title: properties.Title?.title?.[0]?.plain_text || "Untitled Task",
                description: properties.Description?.rich_text?.[0]?.plain_text || "",
                section: properties.Section?.select?.name || "General",
                isCompleted: properties.Completed?.checkbox || false,
                dueDate,
                completedAt,
                priority: properties.Priority?.select?.name || "Medium",
                status: properties.Status?.select?.name || "To Do",
                pharmacy: properties.Pharmacy?.select?.name || "Central Pharmacy",
            };
        });
    } catch (error) {
        console.error("Error fetching tasks from Notion:", error);
        throw new Error("Failed to fetch tasks from Notion");
    }
}

// Get all risk assessments from the Notion database
export async function getRiskAssessments(riskDatabaseId: string) {
    try {
        const response = await notion.databases.query({
            database_id: riskDatabaseId,
        });

        return response.results.map((page: any) => {
            const properties = page.properties;

            const assessmentDate = properties.AssessmentDate?.date?.start
                ? new Date(properties.AssessmentDate.date.start).toISOString()
                : null;

            const nextReviewDate = properties.NextReviewDate?.date?.start
                ? new Date(properties.NextReviewDate.date.start).toISOString()
                : null;

            return {
                notionId: page.id,
                title: properties.Title?.title?.[0]?.plain_text || "Untitled Risk Assessment",
                description: properties.Description?.rich_text?.[0]?.plain_text || "",
                usp_chapter: properties.USPChapter?.select?.name || "General",
                risk_level: properties.RiskLevel?.select?.name || "Medium",
                status: properties.Status?.select?.name || "Identified",
                findings: properties.Findings?.rich_text?.[0]?.plain_text || "",
                mitigation_plan: properties.MitigationPlan?.rich_text?.[0]?.plain_text || "",
                assessment_date: assessmentDate,
                next_review_date: nextReviewDate,
                pharmacy: properties.Pharmacy?.select?.name || "Central Pharmacy",
            };
        });
    } catch (error) {
        console.error("Error fetching risk assessments from Notion:", error);
        throw new Error("Failed to fetch risk assessments from Notion");
    }
}

// Create a new risk assessment in Notion
export async function createRiskAssessment(databaseId: string, riskData: any) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId
            },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: riskData.title
                            }
                        }
                    ]
                },
                Description: {
                    rich_text: [
                        {
                            text: {
                                content: riskData.description || ""
                            }
                        }
                    ]
                },
                USPChapter: {
                    select: {
                        name: riskData.usp_chapter
                    }
                },
                RiskLevel: {
                    select: {
                        name: riskData.risk_level
                    }
                },
                Status: {
                    select: {
                        name: riskData.status
                    }
                },
                Findings: {
                    rich_text: [
                        {
                            text: {
                                content: riskData.findings || ""
                            }
                        }
                    ]
                },
                MitigationPlan: {
                    rich_text: [
                        {
                            text: {
                                content: riskData.mitigation_plan || ""
                            }
                        }
                    ]
                },
                AssessmentDate: riskData.assessment_date ? {
                    date: {
                        start: riskData.assessment_date
                    }
                } : null,
                NextReviewDate: riskData.next_review_date ? {
                    date: {
                        start: riskData.next_review_date
                    }
                } : null,
                Pharmacy: {
                    select: {
                        name: riskData.pharmacy
                    }
                }
            }
        });

        return response;
    } catch (error) {
        console.error("Error creating risk assessment in Notion:", error);
        throw new Error("Failed to create risk assessment in Notion");
    }
}

// Update a risk assessment in Notion
export async function updateRiskAssessment(pageId: string, riskData: any) {
    try {
        const updateData: any = {
            properties: {}
        };

        if (riskData.title !== undefined) {
            updateData.properties.Title = {
                title: [
                    {
                        text: {
                            content: riskData.title
                        }
                    }
                ]
            };
        }

        if (riskData.description !== undefined) {
            updateData.properties.Description = {
                rich_text: [
                    {
                        text: {
                            content: riskData.description
                        }
                    }
                ]
            };
        }

        if (riskData.usp_chapter !== undefined) {
            updateData.properties.USPChapter = {
                select: {
                    name: riskData.usp_chapter
                }
            };
        }

        if (riskData.risk_level !== undefined) {
            updateData.properties.RiskLevel = {
                select: {
                    name: riskData.risk_level
                }
            };
        }

        if (riskData.status !== undefined) {
            updateData.properties.Status = {
                select: {
                    name: riskData.status
                }
            };
        }

        if (riskData.findings !== undefined) {
            updateData.properties.Findings = {
                rich_text: [
                    {
                        text: {
                            content: riskData.findings
                        }
                    }
                ]
            };
        }

        if (riskData.mitigation_plan !== undefined) {
            updateData.properties.MitigationPlan = {
                rich_text: [
                    {
                        text: {
                            content: riskData.mitigation_plan
                        }
                    }
                ]
            };
        }

        if (riskData.assessment_date !== undefined) {
            updateData.properties.AssessmentDate = riskData.assessment_date ? {
                date: {
                    start: riskData.assessment_date
                }
            } : null;
        }

        if (riskData.next_review_date !== undefined) {
            updateData.properties.NextReviewDate = riskData.next_review_date ? {
                date: {
                    start: riskData.next_review_date
                }
            } : null;
        }

        if (riskData.pharmacy !== undefined) {
            updateData.properties.Pharmacy = {
                select: {
                    name: riskData.pharmacy
                }
            };
        }

        const response = await notion.pages.update({
            page_id: pageId,
            ...updateData
        });

        return response;
    } catch (error) {
        console.error("Error updating risk assessment in Notion:", error);
        throw new Error("Failed to update risk assessment in Notion");
    }
}