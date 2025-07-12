export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          bio: string | null
          avatar_url: string | null
          location: string | null
          availability: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          availability?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          availability?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          created_at?: string
        }
      }
      user_skills_offered: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: string | null
          created_at?: string
        }
      }
      user_skills_wanted: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          priority_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          priority_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          priority_level?: string | null
          created_at?: string
        }
      }
      skill_swaps: {
        Row: {
          id: string
          requester_id: string
          provider_id: string
          offered_skill_id: string | null
          requested_skill_id: string | null
          status: string
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          provider_id: string
          offered_skill_id?: string | null
          requested_skill_id?: string | null
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          provider_id?: string
          offered_skill_id?: string | null
          requested_skill_id?: string | null
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          swap_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          swap_id: string
          reviewer_id: string
          reviewee_id: string
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          swap_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
