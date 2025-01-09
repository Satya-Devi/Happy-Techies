import { NextRequest } from "next/server";
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

if (
  !process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
  !process.env.AZURE_OPENAI_API_KEY ||
  !process.env.AZURE_OPENAI_ENDPOINT
) {
  throw new Error("Missing env var(s) from Azure OpenAI");
}

type Query = {
  query: string;
};

type Response = {
  skills: string[];
  location: string | null;
};

const schema = {
  description: "Extract skills and location from a given query",
  type: "object",
  properties: {
    skills: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "An array of skills, technologies, or job roles mentioned in the query",
    },
    location: {
      type: "string",
      description:
        "The city name mentioned in the query, or null if no city is specified",
    },
  },
  required: ["skills", "location"],
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Query;
    const { query } = body;

    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

    const messages = [
      {
        role: "system",
        content: `You are an AI assistant that extracts job-related information from a given query. Analyze the input and return a JSON object with the following properties:
        1. "skills": An array of skills, technologies, or job roles mentioned. Focus on technical skills, programming languages, and relevant technologies. Extract both specific skills (e.g., "Python", "React") and general roles (e.g., "software engineer", "data scientist").
        2. "location": A string containing the city name mentioned, or null if no city is specified.
        Return only the JSON object without any additional text or prefixes.
        Examples:
        Input: "I am a Python developer looking for a job in New York City"
        {
          "skills": ["Python", "software development"],
          "location": "New York City"
        }
        Input: "I am a senior full stack engineer with React and Node.js experience"
        {
          "skills": ["full stack", "React", "Node.js", "senior engineer"],
          "location": null
        }
        Input: "Looking for Azure Data Engineer Jobs in Houston"
        {
          "skills": ["Azure", "Data Engineer"],
          "location": "Houston"
        }
        Input: "Looking for Python jobs in New York"
        {
          "skills": ["Python"],
          "location": "New York"
        }
        Input: "Python"
        {
          "skills": ["Python"],
          "location": null
        }
        Input: "Security Engineer"
        {
          "skills": ["Security Engineer"],
          "location": null
        }
        Input: "Power Apps"
        {
          "skills": ["Power Apps"],
          "location": null
        }
         Input: "New York"
        {
          "skills": null,
          "location": "New York"
        }
        
          
        `,
      },
      {
        role: "user",
        content: query,
      },
    ];

    const result = await client.getChatCompletions(deployment, messages, {
      topP: 0.95,
      temperature: 0.1,
      maxTokens: 200,
      frequencyPenalty: 0,
      presencePenalty: 0,
      tools: [
        {
          type: "function",
          function: {
            name: "extract_skills_and_location",
            parameters: schema,
          },
        },
      ],
    });

    let suggestions: Response = { skills: [], location: null };
    if (
      result.choices &&
      result.choices.length > 0 &&
      result.choices[0].message?.content
    ) {
      suggestions = JSON.parse(result.choices[0].message.content);
    }

    return Response.json(suggestions);
  } catch (err) {
    console.error(err);
    return new Response(String(err), { status: 500 });
  }
}
