export interface FilterData {
    location: string;
    remote: boolean;
    includeFulltime: boolean;
    includeContractor: boolean;
    speciality: string;
    company: string;
    query: string;
}


export interface JobData {
    id: string;
    company_name: string | null;
    job_listing_source_url: string | null;
    job_title: string | null;
    job_location: string | null;
    job_description: string | null;
    skills: string[] | null;
    created_at: any | null;
    employer_logo: string | null;
    job_id: string | null;
    solution_area?: string | null;
    brief_summary?: string | null;
  };