import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

/**
 * Get all documents
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("company_docs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return Response.json({ error: "Failed to fetch documents" }, { status: 500 });
    }

    return Response.json({ documents: data });
  } catch (error) {
    console.error("Error in GET documents:", error);
    return Response.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
