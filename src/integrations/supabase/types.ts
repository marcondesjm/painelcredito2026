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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      landing_pages: {
        Row: {
          about_description: string | null
          about_title: string | null
          access_key: string | null
          background_image: string | null
          color_accent: string | null
          color_background: string | null
          color_icons: string | null
          color_primary: string | null
          color_text: string | null
          color_text_highlight: string | null
          created_at: string
          cta_subtitle: string | null
          cta_title: string | null
          donation_description: string | null
          donation_enabled: boolean | null
          donation_pix_key: string | null
          donation_pix_name: string | null
          donation_qr_code: string | null
          donation_title: string | null
          facebook_pixel: string | null
          faqs: Json | null
          features: Json | null
          font_body: string | null
          font_heading: string | null
          google_analytics: string | null
          google_tag_manager: string | null
          hero_cta_link: string | null
          hero_cta_text: string | null
          hero_image: string | null
          hero_subtitle: string | null
          hero_title: string | null
          how_it_works: Json | null
          id: string
          is_published: boolean | null
          logo_image: string | null
          logo_size: string | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          price_current: number | null
          price_installments: number | null
          price_original: number | null
          pricing_tiers: Json | null
          product_image: string | null
          section_order: Json | null
          secure_purchase_items: Json | null
          slug: string
          social_proof_customers: Json | null
          social_proof_enabled: boolean | null
          social_proof_product_name: string | null
          testimonials: Json | null
          tiktok_pixel: string | null
          title: string
          updated_at: string
          user_id: string
          video_enabled: boolean | null
          video_thumbnail: string | null
          video_title: string | null
          video_url: string | null
          whatsapp_message: string | null
          whatsapp_number: string | null
        }
        Insert: {
          about_description?: string | null
          about_title?: string | null
          access_key?: string | null
          background_image?: string | null
          color_accent?: string | null
          color_background?: string | null
          color_icons?: string | null
          color_primary?: string | null
          color_text?: string | null
          color_text_highlight?: string | null
          created_at?: string
          cta_subtitle?: string | null
          cta_title?: string | null
          donation_description?: string | null
          donation_enabled?: boolean | null
          donation_pix_key?: string | null
          donation_pix_name?: string | null
          donation_qr_code?: string | null
          donation_title?: string | null
          facebook_pixel?: string | null
          faqs?: Json | null
          features?: Json | null
          font_body?: string | null
          font_heading?: string | null
          google_analytics?: string | null
          google_tag_manager?: string | null
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          how_it_works?: Json | null
          id?: string
          is_published?: boolean | null
          logo_image?: string | null
          logo_size?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          price_current?: number | null
          price_installments?: number | null
          price_original?: number | null
          pricing_tiers?: Json | null
          product_image?: string | null
          section_order?: Json | null
          secure_purchase_items?: Json | null
          slug: string
          social_proof_customers?: Json | null
          social_proof_enabled?: boolean | null
          social_proof_product_name?: string | null
          testimonials?: Json | null
          tiktok_pixel?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_enabled?: boolean | null
          video_thumbnail?: string | null
          video_title?: string | null
          video_url?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          about_description?: string | null
          about_title?: string | null
          access_key?: string | null
          background_image?: string | null
          color_accent?: string | null
          color_background?: string | null
          color_icons?: string | null
          color_primary?: string | null
          color_text?: string | null
          color_text_highlight?: string | null
          created_at?: string
          cta_subtitle?: string | null
          cta_title?: string | null
          donation_description?: string | null
          donation_enabled?: boolean | null
          donation_pix_key?: string | null
          donation_pix_name?: string | null
          donation_qr_code?: string | null
          donation_title?: string | null
          facebook_pixel?: string | null
          faqs?: Json | null
          features?: Json | null
          font_body?: string | null
          font_heading?: string | null
          google_analytics?: string | null
          google_tag_manager?: string | null
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          how_it_works?: Json | null
          id?: string
          is_published?: boolean | null
          logo_image?: string | null
          logo_size?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          price_current?: number | null
          price_installments?: number | null
          price_original?: number | null
          pricing_tiers?: Json | null
          product_image?: string | null
          section_order?: Json | null
          secure_purchase_items?: Json | null
          slug?: string
          social_proof_customers?: Json | null
          social_proof_enabled?: boolean | null
          social_proof_product_name?: string | null
          testimonials?: Json | null
          tiktok_pixel?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_enabled?: boolean | null
          video_thumbnail?: string | null
          video_title?: string | null
          video_url?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
