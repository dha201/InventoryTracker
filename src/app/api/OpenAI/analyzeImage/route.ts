import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface AnalyzeImageRequest {
    imageUrl: string;
}

interface AnalysisResult {
    items: Array<{
      item: string;
      count: number;
    }>;
}


export async function POST(req: NextRequest) {
    const { imageUrl } = await req.json() as AnalyzeImageRequest;
    
    console.log('Received image URL for analysis:', imageUrl);

    try {
        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
            role: "user",
            content: [
                { type: "text", text: `scan all items in the image, and then ONLY generate a JSON list of their item with their brand and count. Use this as a template:
                "items": [
                    {
                      "item": "Tostitos Hint of Guacamole",
                      "count": 4
                    },
                    {
                      "brand": "Simple Truth Organic 100% Pure Pumpkin",
                      "count": 1
                    },
                    {
                      "brand": "Good & Gather Greek Yogurt",
                      "count": 2
                    },
                    {
                      "brand": "Kroger Brown Sugar",
                      "count": 1
                    },
                    {
                      "brand": "Private Selection Italian Style Meatballs ",
                      "count": 1
                    },
                  ]` },
                {
                type: "image_url",
                image_url: {
                    "url": imageUrl,
                },
                },
            ],
            },
        ],
        });
        
        let result = response.choices[0]?.message?.content ?? 'No analysis available';
        console.log('Raw analysis result:', result);

        // Clean the result string
        result = result.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

        // Parse the cleaned result
        const parsedResult = JSON.parse(result) as AnalysisResult;
        
        console.log('Parsed analysis result:', parsedResult);
        return NextResponse.json(parsedResult);

    } catch (error) {
        console.error('Error analyzing image:', error);
        return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
    }
}
