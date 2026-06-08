import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { optionId } = await req.json();

  const { data } = await supabase
    .from("poll_options")
    .select("votes")
    .eq("id", optionId)
    .single();

  await supabase
    .from("poll_options")
    .update({ votes: (data?.votes || 0) + 1 })
    .eq("id", optionId);

  return Response.json({ success: true });
}