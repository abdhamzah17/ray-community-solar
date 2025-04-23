export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      communities: {
        Row: {
          admin_id: string
          community_code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          zip_code: string
        }
        Insert: {
          admin_id: string
          community_code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          zip_code: string
        }
        Update: {
          admin_id?: string
          community_code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_solar_provider: boolean | null
          name: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_solar_provider?: boolean | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_solar_provider?: boolean | null
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          community_id: string
          created_at: string | null
          estimated_completion_date: string | null
          id: string
          progress_percentage: number
          provider_id: string
          status: string
          total_cost: number
        }
        Insert: {
          community_id: string
          created_at?: string | null
          estimated_completion_date?: string | null
          id?: string
          progress_percentage?: number
          provider_id: string
          status: string
          total_cost: number
        }
        Update: {
          community_id?: string
          created_at?: string | null
          estimated_completion_date?: string | null
          id?: string
          progress_percentage?: number
          provider_id?: string
          status?: string
          total_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_quotes: {
        Row: {
          created_at: string | null
          details: Json
          id: string
          provider_id: string
          quote_request_id: string
          total_cost: number
        }
        Insert: {
          created_at?: string | null
          details: Json
          id?: string
          provider_id: string
          quote_request_id: string
          total_cost: number
        }
        Update: {
          created_at?: string | null
          details?: Json
          id?: string
          provider_id?: string
          quote_request_id?: string
          total_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "provider_quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_quotes_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          closed_at: string | null
          community_id: string
          created_at: string | null
          id: string
          requested_by: string
          status: string
        }
        Insert: {
          closed_at?: string | null
          community_id: string
          created_at?: string | null
          id?: string
          requested_by: string
          status?: string
        }
        Update: {
          closed_at?: string | null
          community_id?: string
          created_at?: string | null
          id?: string
          requested_by?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      selected_providers: {
        Row: {
          created_at: string | null
          id: string
          provider_id: string
          provider_quote_id: string
          quote_request_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider_id: string
          provider_quote_id: string
          quote_request_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          provider_id?: string
          provider_quote_id?: string
          quote_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "selected_providers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selected_providers_provider_quote_id_fkey"
            columns: ["provider_quote_id"]
            isOneToOne: false
            referencedRelation: "provider_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selected_providers_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          provider_quote_id: string
          quote_request_id: string
          voter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider_quote_id: string
          quote_request_id: string
          voter_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          provider_quote_id?: string
          quote_request_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_provider_quote_id_fkey"
            columns: ["provider_quote_id"]
            isOneToOne: false
            referencedRelation: "provider_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      community_member_counts: {
        Row: {
          community_id: string | null
          member_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
