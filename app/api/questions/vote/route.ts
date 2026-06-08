import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { id, value } = await req.json();

  const { data } = await supabase
    .from("questions")
    .select("votes")
    .eq("id", id)
    .single();

  await supabase
    .from("questions")
    .update({ votes: Math.max(0, (data?.votes || 0) + value) })
    .eq("id", id);

  return Response.json({ success: true });
}