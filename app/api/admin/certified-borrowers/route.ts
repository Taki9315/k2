import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/admin/certified-borrowers
 * Returns all certified borrowers (role = 'certified' OR role = 'borrower' + preferred = true)
 * along with their deal_room_files.
 */
export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    // 1. Fetch certified borrower profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, preferred, created_at")
      .or("role.eq.certified,preferred.eq.true")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Fetch certified borrowers error:", profilesError);
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ borrowers: [] });
    }

    // 2. Fetch deal_room_files for all certified borrowers
    const userIds = profiles.map((p) => p.id);
    const { data: files, error: filesError } = await supabase
      .from("deal_room_files")
      .select("id, user_id, file_name, file_path, file_size, mime_type, category, review_status, created_at")
      .in("user_id", userIds)
      .order("created_at", { ascending: false });

    if (filesError) {
      console.error("Fetch deal room files error:", filesError);
      // Non-fatal, return profiles without files
    }

    // 3. Generate signed URLs for each file
    const filesWithUrls = await Promise.all(
      (files || []).map(async (f) => {
        const { data: urlData } = await supabase.storage
          .from("documents")
          .createSignedUrl(f.file_path, 3600); // 1 hour
        return { ...f, signed_url: urlData?.signedUrl || null };
      })
    );

    // 4. Group files by user_id
    const filesByUser: Record<string, typeof filesWithUrls> = {};
    for (const f of filesWithUrls) {
      if (!filesByUser[f.user_id]) filesByUser[f.user_id] = [];
      filesByUser[f.user_id].push(f);
    }

    // 5. Combine
    const borrowers = profiles.map((p) => ({
      ...p,
      files: filesByUser[p.id] || [],
      file_count: (filesByUser[p.id] || []).length,
    }));

    return NextResponse.json({ borrowers });
  } catch (err) {
    console.error("Admin certified-borrowers GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
