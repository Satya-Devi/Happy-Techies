export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          company_description: string | null;
          company_name: string | null;
          created_at: string | null;
          employer_logo: string | null;
          employment_type: string | null;
          id: string;
          job_description: string | null;
          job_id: string | null;
          job_listing_source_url: string | null;
          job_location: string | null;
          job_title: string | null;
          links: string[] | null;
          remote: boolean | null;
          requirements: string[] | null;
          salary_range: string | null;
          skills: string[] | null;
          brief_summary: string | null;
        };
        Insert: {
          company_description?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          employer_logo?: string | null;
          employment_type?: string | null;
          id?: string;
          job_description?: string | null;
          job_id?: string | null;
          job_listing_source_url?: string | null;
          job_location?: string | null;
          job_title?: string | null;
          links?: string[] | null;
          remote?: boolean | null;
          requirements?: string[] | null;
          salary_range?: string | null;
          skills?: string[] | null;
        };
        Update: {
          company_description?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          employer_logo?: string | null;
          employment_type?: string | null;
          id?: string;
          job_description?: string | null;
          job_id?: string | null;
          job_listing_source_url?: string | null;
          job_location?: string | null;
          job_title?: string | null;
          links?: string[] | null;
          remote?: boolean | null;
          requirements?: string[] | null;
          salary_range?: string | null;
          skills?: string[] | null;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          created_at: string;
          id: number;
          microsoftId: string | null;
          overview: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          microsoftId?: string | null;
          overview?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          microsoftId?: string | null;
          overview?: string | null;
          title?: string | null;
        };
        Relationships: [];
      };
      saved_jobs: {
        Row: {
          company_name: string | null;
          created_at: string;
          employer_logo: string | null;
          id: string;
          job_description: string | null;
          job_id: string | null;
          job_listing_source_url: string | null;
          job_location: string | null;
          job_title: string | null;
          skills: string[] | null;
          user_id: string;
        };
        Insert: {
          company_name?: string | null;
          created_at?: string;
          employer_logo?: string | null;
          id?: string;
          job_description?: string | null;
          job_id?: string | null;
          job_listing_source_url?: string | null;
          job_location?: string | null;
          job_title?: string | null;
          skills?: string[] | null;
          user_id?: string;
        };
        Update: {
          company_name?: string | null;
          created_at?: string;
          employer_logo?: string | null;
          id?: string;
          job_description?: string | null;
          job_id?: string | null;
          job_listing_source_url?: string | null;
          job_location?: string | null;
          job_title?: string | null;
          skills?: string[] | null;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          email: string | null;
          created_at: string;
          password: string;
          id: string;
        };
        Insert: {
          email: string | null;
          created_at: string;
          password: string;
          id: string;
        };
        Update: {
          email: string | null;
          created_at: string;
          password: string;
          id: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          id: number;
          image_url: string;
          link: string | null;
          name: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          description: string;
          id?: number;
          image_url: string;
          link?: string | null;
          name: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: number;
          image_url?: string;
          link?: string | null;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      unique_companies:{
        Row: {
          company_name: string;
        };
        Insert: {
          company_name: string;
        };
        Update: {
          company_name: string;
        };
        Relationships: [];
      }
    };
    Functions: {
      get_distinct_locations: {
        Args: Record<PropertyKey, never>;
        Returns: {
          job_locations: string[];
        }[];
      };
      delete_old_jobs: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      fetch_jobs: {
        Args: {
          p_query?: string;
          p_location?: string;
          p_company?: string;
          p_remote?: string;
          p_include_fulltime?: boolean;
          p_include_contractor?: boolean;
          p_speciality?: string;
          p_page?: number;
          p_items_per_page?: number;
        };
        Returns: {
          job_data: Json;
          total_count: number;
        }[];
      };
      fetch_jobs_v5: {
        Args: {
          p_query?: string;
          p_location?: string;
          p_company?: string;
          p_remote?: string;
          p_include_fulltime?: boolean;
          p_include_contractor?: boolean;
          p_speciality?: string;
          p_page?: number;
          p_items_per_page?: number;
          p_solution_area?: string;
        };
        Returns: {
          job_data: Json;
          total_count: number;
        }[];
      };
      fetch_latest_jobs_v3: {
        Args: {
          p_query?: string;
          p_location?: string;
          p_company?: string;
          p_remote?: string;
          p_include_fulltime?: boolean;
          p_include_contractor?: boolean;
          p_speciality?: string;
          p_page?: number;
          p_items_per_page?: number;
          p_solution_area?: string;
        };
        Returns: {
          job_data: Json;
          total_count: number;
        }[];
      };
      fetch_hot_job_v2: {
        Args: {
          p_query?: string;
          p_location?: string;
          p_company?: string;
          p_remote?: string;
          p_include_fulltime?: boolean;
          p_include_contractor?: boolean;
          p_speciality?: string;
          p_page?: number;
          p_items_per_page?: number;
          p_solution_area?: string;
          p_created_at?: string;
        };
        Returns: {
          job_data: any;
          total_count: number;
        }[];
      };
      get_matching_roles_with_jobs:{
        Returns:{
          matching_roles:string
        }[];
      },
      get_matching_keyword:{
        Returns:{
          matching_roles:string
        }[];
      }
      match_jobs: {
        Args: {
          query_embedding: number[];  // Embedding is usually an array of numbers
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          company_name: string;
          job_title: string;
          job_location: string;
          skills: string[];
          salary_range: string;
          employment_type: string;
          remote: boolean;
          created_at: string;
          brief_summary: string;
          job_listing_source_url: string;
          job_description: string;
          employer_logo: string
        }[];
      };
      set_config: {
        Args: {
          key: string;
          value: string;
        };
        Returns:{}
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;