import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Rasterise the same approved mark viewport for small browser/install icons. */
export async function brandIcon(size: number) {
  const bytes = await readFile(join(process.cwd(), "public/brand/m-air-electro-ai-turquoise.png"));
  const scale = size / 700;
  return new ImageResponse(<div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center", background:"#eef2f3" }}>
    <div style={{ position:"relative", display:"flex", width:size, height:600*scale, overflow:"hidden" }}>
      {/* ImageResponse renders pixels server-side; next/image is not used here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={`data:image/png;base64,${bytes.toString("base64")}`} width={1254*scale} height={1254*scale} style={{ position:"absolute", left:-340*scale, top:-190*scale }} />
    </div>
  </div>, {width:size,height:size});
}
