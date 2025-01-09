import { AzureKeyCredential, OpenAIClient } from "npm:@azure/openai";

Deno.serve(async (req) => {
  try {
    const { query } = await req.json();
    const deployment = Deno.env.get("AZURE_OPENAI_DEPLOYMENT_NAME") ?? "";
    const apiKey = Deno.env.get("AZURE_OPENAI_API_KEY") ?? "";
    const endpoint = Deno.env.get("AZURE_OPENAI_ENDPOINT") ?? "";
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

    const messages = [
      {
        role: "system",
        content: `You are an AI assistant that extracts skills from a given query. When a user provides input, analyze it and return a comma-separated list of skills, technologies, or job roles mentioned. Focus on technical skills, programming languages, job titles, and relevant technologies. Exclude common words or phrases that aren't specific skills or technologies.
        Examples:
        Input: 'I am a software engineer looking for python roles'
        Output: software engineer, python
        Input: 'Experienced data scientist with expertise in machine learning, SQL, and R'
        Output: data scientist, machine learning, SQL, R
        Input: 'Frontend developer proficient in React, JavaScript, and responsive design'
        Output: frontend developer, React, JavaScript, responsive design
        Input: 'DevOps engineer with skills in AWS, Docker, and Kubernetes'
        Output: DevOps engineer, AWS, Docker, Kubernetes
        Input: 'Looking for a role as a project manager in the tech industry'
        Output: project manager
        Provide only the extracted list without any additional explanation or commentary.`,
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
    });

    let suggestions = "";
    for (const choice of result.choices) {
      suggestions += choice.message?.content;
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});

/* To test the function, you can use the following curl command:
curl -L -X POST 'http://localhost:54321/functions/v1/role-suggestions' \
 --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbHd0Y21lbnlyanVld2Fpd3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NzE1OTAsImV4cCI6MjAyODI0NzU5MH0.Bu9ZH2rGhrhue4ccpansLd9N9iWCBvamviWUjDHO7IQ'
  --data '{"query":"I am a software engineer with 5 years of experience in Java and 3 years of experience in Python. I am looking for a role that involves working with microservices and cloud technologies."}'
 */

/* To test the function, you can use the following curl command:
curl -L -X POST 'http://localhost:54321/functions/v1/role-suggestions' \
 --header 'Authorization: Bearer <ANON TOKEN>'
*/

/* To get the local credentials, run the following command:
supabase status
*/
