"use server";

import { getBaseUrl } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/types";
import { getStoryblokApi } from "@storyblok/react/rsc";
import moment from "moment";

export async function fetchNews() {
  const url =
    "https://real-time-news-data.p.rapidapi.com/search?query=microsoft&limit=100&time_published=7d&country=US&lang=en";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEWS_API_KEY as string,
      "x-rapidapi-host": "real-time-news-data.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTopNews() {
  const url =
    "https://real-time-news-data.p.rapidapi.com/search?query=microsoft&limit=9&time_published=7d&country=US&lang=en";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEWS_API_KEY as string,
      "x-rapidapi-host": "real-time-news-data.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchGlassdoorRating(companyId: string) {
  const url = `https://real-time-glassdoor-data.p.rapidapi.com/company-overview?company_id=${companyId}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.GLASSDOOR_API_KEY as string,
      "x-rapidapi-host": "real-time-glassdoor-data.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result, "fetchGlassdoorRating")
    return {
      rating: result.data.rating,
      reviewCount: result.data.review_count,
    };
  } catch (error) {
    console.error(error);
    return { rating: null, reviewCount: null };
  }
}

export async function fetchJobs({
  query,
  location,
  company,
  remote,
  includeFulltime,
  includeContractor,
  speciality,
  page,
  itemsPerPage,
  tab,
  filter
}: {
  query: string;
  location: string;
  company: string;
  remote: string;
  includeFulltime: string;
  includeContractor: string;
  speciality: string;
  page: number;
  itemsPerPage: number;
  tab: string;
  filter: string;
}) {
  const supabase = createClient();
  let function_name: "fetch_jobs_v5" | "fetch_hot_job_v2" | "fetch_latest_jobs_v3" = "fetch_jobs_v5";
  let db_query: {
    p_query: string,
    p_location: string,
    p_company: string,
    p_remote: string,
    p_include_fulltime: boolean,
    p_include_contractor: boolean,
    p_speciality: string,
    p_page: number,
    p_items_per_page: number,
    p_created_at?: string
    p_solution_area?: string
  } = {
    p_query: query,
    p_location: location,
    p_company: company,
    p_remote: remote,
    p_include_fulltime: includeFulltime !== "false",
    p_include_contractor: includeContractor !== "false",
    p_speciality: speciality,
    p_page: page,
    p_items_per_page: itemsPerPage,
    p_solution_area: filter
  }
  if(tab==='hot-jobs'){
    let last8Days = moment().subtract(8, 'days');
    function_name = "fetch_hot_job_v2";
    db_query.p_created_at=last8Days.toISOString();
  }else if(tab==='latest-jobs'){
    function_name = "fetch_latest_jobs_v3";
  }
  console.log(function_name, db_query)
  const { data, error } = await supabase.rpc(function_name, db_query).order("job_data->created_at", { ascending: false }); 
  if (error) {
    console.error("Error fetching jobs:", error);
    return { error: "Error fetching jobs", jobs: null, count: 0 };
  }

  const jobs = data?.map((item:any) => item.job_data);
  const count = data?.[0]?.total_count || 0;
  type Job = Tables<"jobs">;

  return { jobs: jobs as Job[], count };
}

export async function fetchAllLocations() {
  const supabase = createClient();
  const { data, error } = await supabase
  .rpc('get_distinct_locations').order('job_locations', { ascending: true });
  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
  return Array.from(new Set(data.map((location:any) => location.job_locations).map((location:string) => location?.split(",")[0])));
}


export async function fetchAllCompanies() {
  const supabase = createClient();
  const { data, error } = await supabase
  .rpc('get_distinct_company')
  .select('*')
  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
  return data.map((company) => company.company_names).filter((company) => company !== null);
}

export async function fetchRoleSuggestions(query: string) {
  const response = await fetch(`${getBaseUrl()}/api/role-suggestions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getRecommendedJobs(
  skills: string[],
  location: string | null
) {
  const supabase = createClient();
  try {
    const limit = 20;

    // First, search job titles
    let titleQuery = supabase.from("jobs").select("*");

    // Create a condition to check if any skill is in the job title
    const titleConditions = skills
      .map((skill) => `job_title.ilike.%${skill}%`)
      .join(",");

    titleQuery = titleQuery.or(titleConditions);

    // Only apply location filter if location is not null
    if (location !== null) {
      titleQuery = titleQuery.ilike("job_location", `%${location}%`);
    }

    const { data: titleRecs, error: titleError } = await titleQuery.limit(
      limit
    );

    if (titleError) throw titleError;

    // If we don't have 20 results, search job descriptions for the remaining
    if (titleRecs.length < limit) {
      const remainingLimit = limit - titleRecs.length;
      const skillsQuery = skills.join(" | ");
      let descQuery = supabase
        .from("jobs")
        .select("*")
        .textSearch("company_description", skillsQuery, {
          type: "websearch",
          config: "english",
        });

      // Only apply location filter if location is not null
      if (location !== null) {
        descQuery = descQuery.ilike("job_location", `%${location}%`);
      }

      // Exclude jobs already found in title search
      const titleIds = titleRecs.map((job) => job.id);
      descQuery = descQuery.not("id", "in", `(${titleIds.join(",")})`);

      const { data: descRecs, error: descError } = await descQuery.limit(
        remainingLimit
      );

      if (descError) throw descError;

      return [...titleRecs, ...descRecs];
    }

    return titleRecs;
  } catch (error) {
    console.error("Error fetching recommended jobs:", error);
    const { data: fallbackRecs, error: fallbackError } = await supabase
      .from("jobs")
      .select("*")
      .textSearch("company_description", "microsoft")
      .limit(3);

    if (fallbackError) {
      console.error(
        "Error fetching fallback recommended jobs:",
        fallbackError.message
      );
      return null;
    }
    return fallbackRecs;
  }
}

export async function generateJobSuggestions(query: string) {
  const data = await fetchRoleSuggestions(query);
  const { skills, location } = data;
  const recs = await getRecommendedJobs(skills, location);
  return recs;
}

export const fetchPosts = async () => {
  const client = getStoryblokApi();
  const response = await client.getStories({
    content_type: "article",
    version: "published",
    cv: +new Date(),
  });

  return response.data.stories;
};

export const fetchPartners = async (page?:string,count?:string,searchParamsKey?:string) => {
  const client = getStoryblokApi();
  let pageNumber = parseInt(page || "1");
  let countNumber = count ? parseInt(count) : 15; // Default countNumber to 10 if count is not present
  if(['50','75','100'].includes(count ?? '')){
    console.log(count, "count")
    countNumber = parseInt(count || '15');
  }
  if(searchParamsKey){
    pageNumber = 1;
  }
  console.log(countNumber, count, "countNumber")
  const response = await client.getStories({
    content_type: "partner",
    version: "published",
    page: isNaN(pageNumber) ? 1 : pageNumber,
    per_page: countNumber,
    filter_query: searchParamsKey ? {
      name: {
        like: `*${searchParamsKey}*`
      }
    } : null
  });
  return {
    partners: response.data.stories,
    total: response.total,
    perPage: response.perPage,
    page: isNaN(pageNumber) ? 1 : pageNumber
  };
};

export const fetchJobsByKeywords = async () => {
  const keywords = {
    "Data & AI": "Data and AI",
    Security: "Security",
    "Modern Workplace and Surface": "Modern Work",
    Infrastructure: "Infrastructure",
    "Business Applications": "Business Applications",
    "Digital & Application Innovation": "Digital and App Innovation",
  };
  const jobsByKeyword: { [key: string]: any[] } = {};
  const supabase = createClient();
  for (const keyword in keywords) {
    const key = keyword as keyof typeof keywords;
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("solution_area", keywords[key])
      .not('created_at', 'is', null)
      .order("created_at", { ascending: false })
      .limit(2);

    if (error) {
      console.error("Error fetching jobs by keyword:", error);
      return { error: "Error fetching jobs by keyword", jobsByKeyword: null };
    }
    jobsByKeyword[keyword] = data;
  }
  return jobsByKeyword;
};

export const fetchTopRoles= async () => {
  const supabase = createClient();
  const { data, error } = await supabase
  .rpc('get_matching_roles_with_jobs')
  if (error) {
    console.error("Error fetching top roles:", error);
    return [];
  }
  return data.map((obj:{matching_roles:string}) => obj.matching_roles);
}

export const fetchMatchingKeywords= async () => {
  const supabase = createClient();
  const { data, error } = await supabase
  .rpc('get_matching_keyword')
  if (error) {
    console.error("Error fetching top roles:", error);
    return [];
  }
  return data.map((obj:{matching_roles:string}) => obj.matching_roles);
}




const azureOpenAiConfig = {
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
  embeddingDeploymentId: process.env.AZURE_EMBEDDING_DEPLOYMENT_ID || "",
  gptDeploymentId : process.env.AZURE_GPT_DEPLOYMENT_ID || ""
};


export async function getMatchingJobs(query: string) {
  const supabase = createClient();

  try {
    // Generate embeddings of the search query
    const embeddingResponse = await fetch(`${azureOpenAiConfig.endpoint}/openai/deployments/${azureOpenAiConfig.embeddingDeploymentId}/embeddings?api-version=2024-02-15-preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": azureOpenAiConfig.apiKey,
      },
      body: JSON.stringify({
        input: [query],
        model: "text-embedding-ada-002",
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`Embedding API call failed: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Set a configuration for the timeout
    await supabase.rpc('set_config', {
      key: 'statement_timeout',
      value: '10min',
    });

    // Call Supabase RPC to match jobs based on the embedding
    const { data, error } = await supabase.rpc('match_jobs', {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 100,
    });

    if (error) {
      console.error("Supabase RPC Error:", error);
      return [];
    }

    const jobDetailsArray = data?.map((job: any) => ({
      id: job.id,
      company_name: job.company_name,
      job_title: job.job_title,
      job_location: job.job_location,
      skills: job.skills,
      salary_range: job.salary_range,
      employment_type: job.employment_type,
      remote: job.remote,
      created_at: job.created_at,
      brief_summary: job.brief_summary,
      detailed_summary: job.detailed_summary,
      job_listing_source_url : job.job_listing_source_url,
      job_description: job.job_description,
      employer_logo: job.employer_logo,
      similarity_score:job.similarity_score
    }));

    const res = await rerankLLM(query, jobDetailsArray)

    if(res && res.jobs && Array.isArray(res.jobs)){
    const finalResponse = jobDetailsArray
    .filter((item2 : any) => res.jobs.some((item1: any) => item1.job_id=== item2.id))
    .map((item2 : any) => {
      const match = res.jobs.find((item1: any) => item1.job_id === item2.id);
      return { ...item2, ...match };
    });

      return finalResponse;
    }
      return []
  } catch (error) {
    console.error("Error in getMatchingJobs:", error);
    return [];
  }
}

function escapeSpecialCharacters(input: any) {
	return input.replace(/\\/g, '\\\\') // Escape backslashes
				.replace(/'/g, "\\'")   // Escape single quotes
				.replace(/’/g, "")      // Replace all curly/smart
                .replace(/\r/g, '\\r')  // Escape carriage returns
                .replace(/\t/g, '\\t'); // Escape tabs
}


async function rerankLLM(query:string,jobArray:any){
	// Loop through the jobs and clean/escape each job
  console.log("jobArray leng:", jobArray.length)
    const cleanedJobs = jobArray.map((job: any) => {
		const filteredJob = {
            id: job.id,
            detailed_summary: escapeSpecialCharacters(job.detailed_summary || '')
        };
        return filteredJob;
    });

  const openaiPrompt = `Given the user query: "${escapeSpecialCharacters(query)}",
    rank the following job listings based on relevancy, taking into account factors such as job title, location, required skills. Please follow these instructions meticulously before ranking the jobs:
    1. Provide a comprehensive ranked list of all the jobs, ensuring that no job is omitted.
    2. If the user query specifies both skills and location:
        - Rank jobs highest that match both the skills and location exactly.
        - Next, prioritize jobs that match the location, then those within a 50-mile radius of the location.
        - Following that, rank jobs that offer remote work.
        - Lastly, rank all other jobs based on the relevancy of skills and responsibilities.
    3. In no case should jobs with exact matches for both skills and location be ranked lower than others.
    Below are the job listings for you to rank:
    ${cleanedJobs.map((job: any) => JSON.stringify(job)).join(", ")}

    Return the results in the following JSON format:
    {
        "thought_process": "A description of the thought process used for ranking the jobs",
        "jobs": [
            { "job_id": "job.id", "relevancy_score": percentage in numeric format, "reason":"why it was ranked here" }
        ]
    }
`

    const response = await fetch(`${azureOpenAiConfig.endpoint}/openai/deployments/${azureOpenAiConfig.gptDeploymentId}/chat/completions?api-version=2024-02-15-preview`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": azureOpenAiConfig.apiKey,
		},
		body: JSON.stringify({
			messages: [
				{ role: "user", content: openaiPrompt }
			],
			max_tokens: 4096,
			temperature: 0.7,
			model: azureOpenAiConfig.gptDeploymentId
		}),
	});

	if (!response.ok) {
		throw new Error(`OpenAI API call failed: ${response.statusText}`);
	}

	const responseData = await response.json();
	let result = responseData.choices[0].message.content;
	// Remove surrounding markdown code block (```json ... ```)
  // console.log("before parse --------", result)
	result = result.replace(/```json/g, "").replace(/```/g, "").trim();
  // console.log("after parse --------", result)

	//console.log(result)
	//const rankings = JSON.parse(result);

    //const rankings = JSON.parse(response.data.choices[0].text);

    // Return rankings sorted by relevancy score in descending order
    let parsedResult;
    try {
        parsedResult = JSON.parse(result);
    } catch (error) {
        console.error("Failed to parse result:", error);
        throw new Error("Failed to parse JSON response");
    }

    return parsedResult || [];
}