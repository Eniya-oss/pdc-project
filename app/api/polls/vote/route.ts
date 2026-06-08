import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: polls } = await supabase.from("polls").select("*");
    const { data: options } = await supabase.from("poll_options").select("*");

    const result =
      polls?.map((p) => ({
        ...p,
        options: options?.filter((o) => o.poll_id === p.id) || [],
      })) || [];

    return Response.json(result);
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { question, option1, option2 } = await req.json();

    const { data: poll } = await supabase
      .from("polls")
      .insert([{ question }])
      .select()
      .single();

    await supabase.from("poll_options").insert([
      { poll_id: poll.id, text: option1 },
      { poll_id: poll.id, text: option2 },
    ]);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "failed" }, { status: 500 });
  }
}