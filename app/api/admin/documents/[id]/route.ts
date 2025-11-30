import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

/**
 * Delete a document
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete document (vectors will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from("company_docs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting document:", error);
      return Response.json({ error: "Failed to delete document" }, { status: 500 });
    }

    return Response.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE document:", error);
    return Response.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
