import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false });

  return Response.json(data);
}

export async function POST(req: Request) {
  const { text } = await req.json();

  const { data } = await supabase
    .from("questions")
    .insert([{ text }])
    .select();

  return Response.json(data);
}