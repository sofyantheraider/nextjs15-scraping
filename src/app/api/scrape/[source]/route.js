import axios from "axios";
import * as cheerio from "cheerio";

// 📦 Daftar situs yang bisa di-scrape
const sources = {
  quotationspage_qotd: {
    url: "https://www.quotationspage.com/qotd.html",
    selector: "dt.quote",
    extract: ($, el) => ({
      quote: $(el).find("a").text().trim(),
      author: $(el).next("dd.author").find("b a").text().trim(),
      source: "quotationspage",
    }),
  },
  quotationspage_mqotd: {
    url: "https://www.quotationspage.com/mqotd.html",
    selector: "dt.quote",
    extract: ($, el) => ({
      quote: $(el).find("a").text().trim(),
      author: $(el).next("dd.author").find("b a").text().trim(),
      source: "quotationspage",
    }),
  },

  quotationspage_random: {
    url: "https://www.quotationspage.com/random.php",
    selector: "dt.quote",
    extract: ($, el) => ({
      quote: $(el).find("a").text().trim(),
      author: $(el).next("dd.author").find("b a").text().trim(),
      source: "quotationspage",
    }),
  },

  azquotes: {
    url: "https://www.azquotes.com/quote_of_the_day.html",
    selector: ".list-quotes > li",
    extract: ($, el) => ({
      quote: $(el)
        .find(".wrap-block")
        .children("p")
        .children(".title")
        .text()
        .trim(),
      author: $(el)
        .find(".wrap-block")
        .children(".author")
        .children("a")
        .text()
        .trim(),
      source: "azquotes",
    }),
  },

  quotefancy: {
    url: "https://quotefancy.com/motivational-quotes",
    selector: ".q-container > .q-wrapper",
    extract: ($, el) => ({
      quote: $(el).find(".quote-p").children("a").text().trim(),
      author: $(el).find(".author-p").children("a").first().text().trim(),
      source: "quotefancy",
    }),
  },
  detik: {
    url: "https://www.detik.com/",
    selector: ".media__title > a",
    extract: ($, el) => ({
      title: $(el).text().trim(),
      url: $(el).attr("href"),
      source: "Detik",
    }),
  },
  kompas: {
    url: "https://www.kompas.com/",
    selector: ".mostItem > a",
    extract: ($, el) => ({
      title: $(el).text().trim(),
      url: $(el).attr("href"),
      source: "Kompas",
    }),
  },
  cnn: {
    url: "https://www.cnnindonesia.com/",
    selector: "article.flex-grow > a",
    extract: ($, el) => ({
      title: $(el).find("h2").text().trim(),
      url: $(el).attr("href"),
      source: "CNN Indonesia",
    }),
  },
  liputan6: {
    url: "https://www.liputan6.com/",
    selector: "div.articles--iridescent-list__item > article > a",
    extract: ($, el) => ({
      title: $(el).find("h4").text().trim(),
      url: $(el).attr("href"),
      source: "Liputan6",
    }),
  },
  cnbc: {
    url: "https://www.cnbcindonesia.com/",
    selector: "div.box.news > article h2 a",
    extract: ($, el) => ({
      title: $(el).text().trim(),
      url: $(el).attr("href"),
      source: "CNBC Indonesia",
    }),
  },
};

export async function GET(req, { params }) {
  const { source } = params;

  const config = sources[source];

  if (!config) {
    return Response.json(
      { error: `Sumber '${source}' tidak dikenali.` },
      { status: 404 }
    );
  }

  try {
    const res = await axios.get(config.url);
    const $ = cheerio.load(res.data);
    const items = [];

    $(config.selector).each((_, el) => {
      items.push(config.extract($, el));
    });

    return Response.json(items);
  } catch (error) {
    return Response.json(
      { error: `Gagal scraping '${source}'`, detail: error.message },
      { status: 500 }
    );
  }
}
