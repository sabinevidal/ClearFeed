import { prisma } from './db';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface PatternDetection {
  patternName: string;
  timestamp?: string;
  description: string;
}

interface AnalysisResult {
  riskScore: number;
  patterns: PatternDetection[];
  summary: string;
}

export async function analyzeVideo(videoId: string): Promise<AnalysisResult> {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new Error(`Video not found: ${videoId}`);
  }

  const knownPatterns = await prisma.pattern.findMany();
  const patternNames = knownPatterns.map((p) => p.name);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = buildAnalysisPrompt(video.title, video.youtubeUrl, patternNames);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const textContent =
    data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(textContent);
  } catch {
    throw new Error(`Failed to parse Gemini response: ${textContent}`);
  }

  // Validate and clamp risk score
  parsed.riskScore = Math.max(1, Math.min(10, Math.round(parsed.riskScore || 5)));

  // Save results to database
  await saveAnalysisResults(videoId, parsed, knownPatterns);

  return parsed;
}

function buildAnalysisPrompt(
  title: string,
  url: string,
  patternNames: string[]
): string {
  return `You are an expert in media literacy and child psychology. Analyze the following YouTube video for manipulation patterns that could affect children aged 5-15.

Video Title: "${title}"
Video URL: ${url}

Known manipulation patterns to check for:
${patternNames.map((name) => `- ${name}`).join('\n')}

Based on the video title, URL, and your knowledge of common YouTube content patterns, provide an analysis. Consider:
1. The title's use of clickbait or emotional manipulation
2. Common patterns associated with this type of content
3. The likely target audience and potential psychological impact

Respond with a JSON object in this exact format:
{
  "riskScore": <number 1-10, where 1 is completely safe and 10 is highly manipulative>,
  "patterns": [
    {
      "patternName": "<exact name from the known patterns list>",
      "timestamp": "<approximate timestamp or null>",
      "description": "<specific explanation of how this pattern appears in this video>"
    }
  ],
  "summary": "<2-3 sentence summary of the overall manipulation risk for a parent>"
}

Only include patterns you have reasonable confidence are present. Be conservative — it's better to miss a pattern than to falsely flag one. If the video appears to be educational or safe content, give it a low risk score.`;
}

async function saveAnalysisResults(
  videoId: string,
  result: AnalysisResult,
  knownPatterns: { id: string; name: string }[]
) {
  // Map pattern names to IDs
  const patternMap = new Map(knownPatterns.map((p) => [p.name, p.id]));

  // Create VideoPattern records for detected patterns
  const videoPatterns = result.patterns
    .filter((p) => patternMap.has(p.patternName))
    .map((p) => ({
      videoId,
      patternId: patternMap.get(p.patternName)!,
      timestamp: p.timestamp || null,
      description: p.description,
    }));

  // Update video with results and create pattern associations
  await prisma.$transaction([
    prisma.video.update({
      where: { id: videoId },
      data: {
        riskScore: result.riskScore,
        analyzedAt: new Date(),
        // Auto-approve if risk score is low (threshold can be per-child later)
        status: result.riskScore <= 4 ? 'APPROVED' : 'PENDING',
      },
    }),
    // Delete existing patterns for this video (in case of re-analysis)
    prisma.videoPattern.deleteMany({
      where: { videoId },
    }),
    // Create new pattern associations
    ...videoPatterns.map((vp) =>
      prisma.videoPattern.create({ data: vp })
    ),
  ]);
}
