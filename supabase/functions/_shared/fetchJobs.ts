export const fetchJobs = async (keyword: string, page: number) => {
  const url =
    `https://jsearch.p.rapidapi.com/search?query=${keyword}&page=${page}&num_pages=1`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": Deno.env.get("JSEARCH_API_KEY") ?? "",
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  };

  let jobs = {};
  try {
    const response = await fetch(url, options);
    jobs = await response.json();
  } catch (error) {
    console.error(error);
  }

  return jobs;
};
