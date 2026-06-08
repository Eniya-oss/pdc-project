import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { id } = await req.json();

  const { data } = await supabase
    .from("questions")
    .select("pinned")
    .eq("id", id)
    .single();

  await supabase
    .from("questions")
    .update({ pinned: !data?.pinned })
    .eq("id", id);

  return Response.json({ success: true });
}