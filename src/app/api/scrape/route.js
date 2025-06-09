import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 1. Ambil halaman target
    const response = await axios.get("https://www.detik.com/");
    const $ = cheerio.load(response.data);

    // 2. Parse headline
    const headlines = [];

    $(".media__title > a").each((_, el) => {
      headlines.push({
        title: $(el).text().trim(),
        url: $(el).attr("href"),
      });
    });

    // 3. Simpan hasil ke file JSON (opsional)
    const filePath = path.join(process.cwd(), "public", "headlines.json");
    fs.writeFileSync(filePath, JSON.stringify(headlines, null, 2));

    // 4. Kirim hasil sebagai response JSON
    return Response.json(headlines);
  } catch (err) {
    return Response.json(
      { error: "Scraping gagal", detail: err.message },
      { status: 500 }
    );
  }
}
