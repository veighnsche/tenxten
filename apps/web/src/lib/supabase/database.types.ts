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
      profiles: {
        Row: {
          id: string
          callsign: string
          email: string
          avatar_url: string | null
          identity_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          callsign: string
          email: string
          avatar_url?: string | null
          identity_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          callsign?: string
          email?: string
          avatar_url?: string | null
          identity_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          slug: string
          domain: string
          difficulty: "easy" | "medium" | "hard" | "extreme"
          track: "native" | "augmented"
          description: string
          constraints: string[]
          hints: string[]
          time_limit_seconds: number
          starter_code: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          domain: string
          difficulty: "easy" | "medium" | "hard" | "extreme"
          track: "native" | "augmented"
          description: string
          constraints?: string[]
          hints?: string[]
          time_limit_seconds: number
          starter_code?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          domain?: string
          difficulty?: "easy" | "medium" | "hard" | "extreme"
          track?: "native" | "augmented"
          description?: string
          constraints?: string[]
          hints?: string[]
          time_limit_seconds?: number
          starter_code?: Json
          created_at?: string
          updated_at?: string
        }
      }
      challenge_examples: {
        Row: {
          id: string
          challenge_id: string
          input: string
          output: string
          explanation: string | null
          order: number
        }
        Insert: {
          id?: string
          challenge_id: string
          input: string
          output: string
          explanation?: string | null
          order?: number
        }
        Update: {
          id?: string
          challenge_id?: string
          input?: string
          output?: string
          explanation?: string | null
          order?: number
        }
      }
      challenge_test_cases: {
        Row: {
          id: string
          challenge_id: string
          input: string
          expected_output: string
          is_hidden: boolean
          order: number
        }
        Insert: {
          id?: string
          challenge_id: string
          input: string
          expected_output: string
          is_hidden?: boolean
          order?: number
        }
        Update: {
          id?: string
          challenge_id?: string
          input?: string
          expected_output?: string
          is_hidden?: boolean
          order?: number
        }
      }
      challenge_attempts: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          status: "in_progress" | "submitted" | "passed" | "failed" | "timed_out"
          code: string
          language: string
          started_at: string
          submitted_at: string | null
          time_spent_seconds: number | null
          tests_passed: number
          tests_total: number
          ai_prompts_count: number | null
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          status?: "in_progress" | "submitted" | "passed" | "failed" | "timed_out"
          code?: string
          language?: string
          started_at?: string
          submitted_at?: string | null
          time_spent_seconds?: number | null
          tests_passed?: number
          tests_total?: number
          ai_prompts_count?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          status?: "in_progress" | "submitted" | "passed" | "failed" | "timed_out"
          code?: string
          language?: string
          started_at?: string
          submitted_at?: string | null
          time_spent_seconds?: number | null
          tests_passed?: number
          tests_total?: number
          ai_prompts_count?: number | null
        }
      }
      certifications: {
        Row: {
          id: string
          user_id: string
          track: "native" | "augmented"
          status: "pending" | "verified" | "expired" | "revoked"
          issued_at: string | null
          expires_at: string | null
          verification_hash: string | null
          challenges_completed: string[]
        }
        Insert: {
          id?: string
          user_id: string
          track: "native" | "augmented"
          status?: "pending" | "verified" | "expired" | "revoked"
          issued_at?: string | null
          expires_at?: string | null
          verification_hash?: string | null
          challenges_completed?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          track?: "native" | "augmented"
          status?: "pending" | "verified" | "expired" | "revoked"
          issued_at?: string | null
          expires_at?: string | null
          verification_hash?: string | null
          challenges_completed?: string[]
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
      difficulty: "easy" | "medium" | "hard" | "extreme"
      track: "native" | "augmented"
      attempt_status: "in_progress" | "submitted" | "passed" | "failed" | "timed_out"
      certification_status: "pending" | "verified" | "expired" | "revoked"
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type Insertable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type Updatable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
