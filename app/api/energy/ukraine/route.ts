import { NextResponse } from "next/server";
import { demoUkraineEnergyAdapter } from "@/lib/energy/adapters";
export async function GET() { return NextResponse.json(await demoUkraineEnergyAdapter.getSnapshot(), { headers: { "Cache-Control": "no-store" } }); }
