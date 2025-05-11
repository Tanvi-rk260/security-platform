import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'with', 'you', 'was', 'this', 'that',
  'from', 'have', 'has', 'had', 'not', 'all', 'can', 'your', 'about', 'they',
  'will', 'would', 'there', 'their', 'what', 'when', 'which', 'how', 'who',
  'our', 'out', 'into', 'them', 'his', 'her', 'she', 'him', 'its', 'then', 'been', 'being', 'also'
]);

export async function POST(req) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const text = $('body').text().replace(/\s+/g, ' ').toLowerCase();

    const words = text.match(/\b\w+\b/g) || [];
    const filteredWords = words.filter(word => word.length > 2 && !STOPWORDS.has(word));
    const totalWords = filteredWords.length;

    // Single keyword count
    const singleCounts = {};
    filteredWords.forEach(word => {
      singleCounts[word] = (singleCounts[word] || 0) + 1;
    });

    // Bigrams (two-word phrases)
    const bigramCounts = {};
    for (let i = 0; i < filteredWords.length - 1; i++) {
      const pair = `${filteredWords[i]} ${filteredWords[i + 1]}`;
      bigramCounts[pair] = (bigramCounts[pair] || 0) + 1;
    }

    const singleDensity = Object.entries(singleCounts)
      .map(([word, count]) => ({
        phrase: word,
        count,
        percentage: ((count / totalWords) * 100).toFixed(2),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const bigramDensity = Object.entries(bigramCounts)
      .map(([phrase, count]) => ({
        phrase,
        count,
        percentage: ((count / totalWords) * 100).toFixed(2),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      singleWords: singleDensity,
      phrases: bigramDensity,
      totalWords,
    });

  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed', details: err.message }, { status: 500 });
  }
}
