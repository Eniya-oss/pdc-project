import { supabase } from "@/lib/supabase";

type Reaction = "happy" | "neutral" | "sad";

export async function POST(req: Request) {
  const { id, reaction } = await req.json();

  const column: Reaction = reaction;

  // STEP 1: get current question
  const { data: question } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();

  if (!question) {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }

  // STEP 2: update safely (NO TYPE ERROR)
  const updatedValue =
    column === "happy"
      ? question.happy
      : column === "neutral"
      ? question.neutral
      : question.sad;

  await supabase
    .from("questions")
    .update({
      [column]: updatedValue + 1,
    })
    .eq("id", id);

  return Response.json({ success: true });
}