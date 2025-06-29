import { NextRequest, NextResponse } from 'next/server';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'El tema es requerido' },
        { status: 400 }
      );
    }

    // Verificar que existe la API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY no está configurada');
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    console.log('🤖 Generando pregunta con Gemini para el tema:', topic);

    // Prompt optimizado para Gemini
    const prompt = `Eres un experto en educación. Genera una pregunta de opción múltiple sobre: "${topic}"

INSTRUCCIONES:
- Crea una pregunta clara y educativa
- Genera exactamente 4 opciones
- Solo UNA opción debe ser correcta
- Las opciones incorrectas deben ser plausibles
- Responde SOLO en formato JSON válido, sin texto adicional

FORMATO DE RESPUESTA:
{
  "question": "¿Cuál es la función principal de ${topic}?",
  "option_1": "Primera opción",
  "option_2": "Segunda opción (correcta)",
  "option_3": "Tercera opción",
  "option_4": "Cuarta opción",
  "correct_option": 2,
  "explanation": "Explicación breve de por qué la opción 2 es correcta"
}

Genera la pregunta ahora:`;

    // Llamada a Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('❌ Error de Gemini API:', errorText);
      return NextResponse.json(
        { error: `Error de Gemini API: ${geminiResponse.status}` },
        { status: 500 }
      );
    }

    const geminiData: GeminiResponse = await geminiResponse.json();
    
    // Extraer la respuesta de texto
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.error('❌ No se recibió respuesta de Gemini');
      return NextResponse.json(
        { error: 'No se recibió respuesta de la IA' },
        { status: 500 }
      );
    }

    console.log('🤖 Respuesta bruta de Gemini:', aiResponse);

    // Limpiar la respuesta para extraer solo el JSON
    let cleanedResponse = aiResponse.trim();
    
    // Remover marcadores de código si existen
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '');
    cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    cleanedResponse = cleanedResponse.replace(/^[^{]*/, ''); // Remover texto antes del JSON
    cleanedResponse = cleanedResponse.replace(/[^}]*$/, ''); // Remover texto después del JSON

    // Parsear la respuesta JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ Error parseando respuesta de Gemini:', cleanedResponse);
      console.error('Error de parseo:', parseError);
      
      // Fallback: crear pregunta básica
      parsedResponse = {
        question: `¿Cuál de las siguientes afirmaciones sobre ${topic} es correcta?`,
        option_1: "Opción generada automáticamente 1",
        option_2: "Opción generada automáticamente 2",
        option_3: "Opción generada automáticamente 3", 
        option_4: "Opción generada automáticamente 4",
        correct_option: 1,
        explanation: `Esta es una pregunta básica sobre ${topic}`
      };
    }

    // Validar que la respuesta tenga todos los campos necesarios
    if (!parsedResponse.question || !parsedResponse.option_1 || !parsedResponse.correct_option) {
      console.warn('⚠️ Respuesta incompleta, usando fallback');
      
      parsedResponse = {
        question: `¿Qué característica define principalmente a ${topic}?`,
        option_1: "Primera característica",
        option_2: "Segunda característica",
        option_3: "Tercera característica",
        option_4: "Cuarta característica", 
        correct_option: 1,
        explanation: `Pregunta educativa sobre ${topic}`
      };
    }

    console.log('✅ Pregunta generada exitosamente con Gemini:', parsedResponse);
    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('💥 Error general en generate-question API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al generar la pregunta' },
      { status: 500 }
    );
  }
}