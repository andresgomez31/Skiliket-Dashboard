export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      locations: {
        Row: {
          from_dt: string | null
          location: unknown
          node: number
          to_dt: string | null
        }
        Insert: {
          from_dt?: string | null
          location: unknown
          node: number
          to_dt?: string | null
        }
        Update: {
          from_dt?: string | null
          location?: unknown
          node?: number
          to_dt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      measures: {
        Row: {
          co2: number
          humidity: number
          measured_at: string | null
          node: number
          noise: number
          uv: number
        }
        Insert: {
          co2: number
          humidity: number
          measured_at?: string | null
          node: number
          noise: number
          uv: number
        }
        Update: {
          co2?: number
          humidity?: number
          measured_at?: string | null
          node?: number
          noise?: number
          uv?: number
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      nodes: {
        Row: {
          deleted_at: string | null
          id: number
          name: string
        }
        Insert: {
          deleted_at?: string | null
          id?: number
          name: string
        }
        Update: {
          deleted_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      sensors: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      crowd_index: {
        Row: {
          co2: number | null
          crowd_index: number | null
          humidity: number | null
          measured_at: string | null
          node: number | null
          noise: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_global_stats: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          day: string | null
          samples: number | null
        }
        Relationships: []
      }
      daily_node_stats: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          co2_p50: number | null
          co2_p90: number | null
          co2_p99: number | null
          day: string | null
          max_co2: number | null
          min_co2: number | null
          node: number | null
          samples: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      hourly_smoothed: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          hour: string | null
          node: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      measure_with_location: {
        Row: {
          co2: number | null
          humidity: number | null
          location: unknown
          measured_at: string | null
          node: number | null
          noise: number | null
          uv: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_avg: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          lat: number | null
          lon: number | null
          node: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      anomaly_score_co2: {
        Args: { node_id: number }
        Returns: {
          co2: number
          measured_at: string
          zscore: number
        }[]
      }
      node_stats: {
        Args: { node_id: number }
        Returns: {
          avg_co2: number
          avg_humidity: number
          avg_noise: number
          avg_uv: number
          max_co2: number
          min_co2: number
          p50_co2: number
          p90_co2: number
          p99_co2: number
        }[]
      }
      refresh_iot_materialized_views: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  simulation: {
    Tables: {
      locations: {
        Row: {
          from_dt: string
          location: unknown
          node: number
          to_dt: string
        }
        Insert: {
          from_dt?: string
          location: unknown
          node: number
          to_dt?: string
        }
        Update: {
          from_dt?: string
          location?: unknown
          node?: number
          to_dt?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      measures: {
        Row: {
          co2: number
          humidity: number
          measured_at: string | null
          node: number
          noise: number
          uv: number
        }
        Insert: {
          co2: number
          humidity: number
          measured_at?: string | null
          node: number
          noise: number
          uv: number
        }
        Update: {
          co2?: number
          humidity?: number
          measured_at?: string | null
          node?: number
          noise?: number
          uv?: number
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      nodes: {
        Row: {
          deleted_at: string | null
          id: number
          name: string
        }
        Insert: {
          deleted_at?: string | null
          id?: number
          name: string
        }
        Update: {
          deleted_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      sensors: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      crowd_index: {
        Row: {
          co2: number | null
          crowd_index: number | null
          humidity: number | null
          measured_at: string | null
          node: number | null
          noise: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_global_stats: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          day: string | null
          samples: number | null
        }
        Relationships: []
      }
      daily_node_stats: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          co2_p50: number | null
          co2_p90: number | null
          co2_p99: number | null
          day: string | null
          max_co2: number | null
          min_co2: number | null
          node: number | null
          samples: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      hourly_smoothed: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          hour: string | null
          node: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      measure_with_location: {
        Row: {
          co2: number | null
          humidity: number | null
          location: unknown
          measured_at: string | null
          node: number | null
          noise: number | null
          uv: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_avg: {
        Row: {
          avg_co2: number | null
          avg_humidity: number | null
          avg_noise: number | null
          avg_uv: number | null
          lat: number | null
          lon: number | null
          node: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measures_node_fkey"
            columns: ["node"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      anomaly_score_co2: {
        Args: { node_id: number }
        Returns: {
          co2: number
          measured_at: string
          zscore: number
        }[]
      }
      node_stats: {
        Args: { node_id: number }
        Returns: {
          avg_co2: number
          avg_humidity: number
          avg_noise: number
          avg_uv: number
          max_co2: number
          min_co2: number
          p50_co2: number
          p90_co2: number
          p99_co2: number
        }[]
      }
      refresh_iot_materialized_views: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
  simulation: {
    Enums: {},
  },
} as const
