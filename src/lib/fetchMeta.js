  import * as cheerio from 'cheerio';

export async function fetchAndParseMeta(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const metaTags = [];

  $('meta').each((_, el) => {
    const name = $(el).attr('name') || $(el).attr('http-equiv') || $(el).attr('property');
    const content = $(el).attr('content');
    if (name && content) {
      metaTags.push({ name, content });
    }
  });

  return metaTags;
}
