import { NextResponse } from "next/server";


const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");

if (!key?.accountId) {
    console.error("no account");
}

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Boilerplate",
            description: "API for the boilerplate",
            version: "1.0.0",
        },
        servers: [
            {
                url: config.url,
            },
        ],
        "x-mb": {
            "account-id": key.accountId,
            assistant: {
                name: "Odds Assistant",
                description: "An assistant that answers with blockchain information",
                instructions: "You answer with a list of blockchains. Use the tools to get blockchain information.",
                tools: [{ type: "generate-transaction" }, { type: "get-blochains" }, { type: "get-odds" }]
            },
        },
        paths: {
            "/api/tools/get-blockchains": {
                get: {
                    summary: "get blockchain information",
                    description: "Respond with a list of blockchains",
                    operationId: "get-blockchains",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description: "The list of blockchains",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/odds/get-odds": {
                get: {
                    summary: "Get soccer odds information",
                    description: "Respond with a list of soccer games and their odds",
                    operationId: "get-odds",
                    parameters: [
                        {
                            name: "team",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Filter the results by the specified team name"
                        },
                        {
                            name: "sport",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                default: "soccer"
                            },
                            description: "The sport key for which to return events and odds"
                        },
                        {
                            name: "regions",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                default: "us"
                            },
                            description: "Specifies the region for bookmakers"
                        },
                        {
                            name: "markets",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                default: "h2h,spreads"
                            },
                            description: "The odds market to return (e.g., head-to-head, spreads)"
                        },
                        {
                            name: "dateFormat",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                default: "iso"
                            },
                            description: "Format of returned timestamps (e.g., iso or unix)"
                        },
                        {
                            name: "oddsFormat",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                default: "decimal"
                            },
                            description: "Format of returned odds (e.g., decimal or fractional)"
                        },
                        {
                            name: "commenceTimeFrom",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                format: "date-time",
                                default: "2023-09-09T00:00:00Z"
                            },
                            description: "Start time to filter events"
                        },
                        {
                            name: "commenceTimeTo",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                format: "date-time",
                                default: "2023-09-09T00:00:00Z"
                            },
                            description: "End time to filter events"
                        },
                        {
                            name: "includeLinks",
                            in: "query",
                            required: false,
                            schema: {
                                type: "boolean",
                                default: true
                            },
                            description: "Include bookmaker links in the response"
                        },
                        {
                            name: "includeSids",
                            in: "query",
                            required: false,
                            schema: {
                                type: "boolean",
                                default: true
                            },
                            description: "Include source IDs (bookmaker IDs) in the response"
                        },
                        {
                            name: "includeBetLimits",
                            in: "query",
                            required: false,
                            schema: {
                                type: "boolean",
                                default: true
                            },
                            description: "Include bet limits in the response"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            data: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "string" },
                                                        sport_key: { type: "string" },
                                                        sport_title: { type: "string" },
                                                        commence_time: { type: "string", format: "date-time" },
                                                        home_team: { type: "string" },
                                                        away_team: { type: "string" },
                                                        bookmakers: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    key: { type: "string" },
                                                                    title: { type: "string" },
                                                                    last_update: { type: "string", format: "date-time" },
                                                                    link: { type: "string" },
                                                                    sid: { type: "string" },
                                                                    markets: {
                                                                        type: "array",
                                                                        items: {
                                                                            type: "object",
                                                                            properties: {
                                                                                key: { type: "string" },
                                                                                last_update: { type: "string", format: "date-time" },
                                                                                outcomes: {
                                                                                    type: "array",
                                                                                    items: {
                                                                                        type: "object",
                                                                                        properties: {
                                                                                            name: { type: "string" },
                                                                                            price: { type: "number" },
                                                                                            link: { type: "string" },
                                                                                            sid: { type: "string" },
                                                                                            bet_limit: { type: "number", nullable: true }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "API key missing or server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, 
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Respond with user account ID",
                    operationId: "get-user",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accountId: {
                                                type: "string",
                                                description: "The user's account ID",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/reddit": {
                get: {
                    summary: "get Reddit frontpage posts",
                    description: "Fetch and return a list of posts from the Reddit frontpage",
                    operationId: "get-reddit-posts",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            posts: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        title: {
                                                            type: "string",
                                                            description: "The title of the post"
                                                        },
                                                        author: {
                                                            type: "string",
                                                            description: "The username of the post author"
                                                        },
                                                        subreddit: {
                                                            type: "string",
                                                            description: "The subreddit where the post was made"
                                                        },
                                                        score: {
                                                            type: "number",
                                                            description: "The score (upvotes) of the post"
                                                        },
                                                        num_comments: {
                                                            type: "number",
                                                            description: "The number of comments on the post"
                                                        },
                                                        url: {
                                                            type: "string",
                                                            description: "The URL of the post on Reddit"
                                                        }
                                                    }
                                                },
                                                description: "An array of Reddit posts"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/twitter": {
                get: {
                    operationId: "getTwitterShareIntent",
                    summary: "Generate a Twitter share intent URL",
                    description: "Creates a Twitter share intent URL based on provided parameters",
                    parameters: [
                        {
                            name: "text",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The text content of the tweet"
                        },
                        {
                            name: "url",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The URL to be shared in the tweet"
                        },
                        {
                            name: "hashtags",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Comma-separated hashtags for the tweet"
                        },
                        {
                            name: "via",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The Twitter username to attribute the tweet to"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            twitterIntentUrl: {
                                                type: "string",
                                                description: "The generated Twitter share intent URL"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-transaction": {
                get: {
                    operationId: "createNearTransaction",
                    summary: "Create a NEAR transaction payload",
                    description: "Generates a NEAR transaction payload for transferring tokens",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID of the receiver"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of NEAR tokens to transfer"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (e.g., 'Transfer')"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description: "The amount to transfer in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/coinflip": {
                get: {
                    summary: "Coin flip",
                    description: "Flip a coin and return the result (heads or tails)",
                    operationId: "coinFlip",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: {
                                                type: "string",
                                                description: "The result of the coin flip (heads or tails)",
                                                enum: ["heads", "tails"]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    };

    return NextResponse.json(pluginData);
}