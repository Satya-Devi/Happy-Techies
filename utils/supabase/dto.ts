export type Job = {
  company_description: string | null;
  company_name: string | null;
  created_at: string;
  id: string;
  job_description: string | null;
  job_listing_source_url: string | null;
  job_location: string | null;
  job_title: string | null;
  requirements: string[] | null;
  salary_range: string | null;
  skills: string[] | null;
  employer_logo: string | null;
  employment_type: string | null;
  brief_summary: string | null;
};

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
