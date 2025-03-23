import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type: "upsert";
      data: {
        value: number;
      };
    };

    const moisture = Math.round(100 - (body.data.value / 4095) * 100);
    console.log("✱ ⟶ route.ts ⟶ POST ⟶ moisture:", moisture);
    await supabase.from("logs").insert([
      {
        device: 1,
        moisture,
        time: new Date().toISOString(),
      },
    ]);

    return Response.json({ ...body });
  } catch (error) {
    console.error(`[ERROR](api/route.ts): ${(error as Error).message}`);
    return Response.json(
      { error: "[ERROR]: something went wrong" },
      { status: 500 },
    );
  }
}
