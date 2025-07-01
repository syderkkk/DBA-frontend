interface GeneratedQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface AIResponse {
  question: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_option: number;
  explanation?: string;
}

export async function generateQuestionWithAI(topic: string): Promise<GeneratedQuestion> {
  try {
    console.log('🤖 Generando pregunta con IA para el tema:', topic);
    
    const response = await fetch('/api/generate-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data: AIResponse = await response.json();
    
    return {
      question: data.question,
      options: [data.option_1, data.option_2, data.option_3, data.option_4],
      correctIndex: data.correct_option - 1,
      explanation: data.explanation,
    };
  } catch (error) {
    console.error('💥 Error al generar pregunta con IA:', error);
    throw new Error('No se pudo generar la pregunta. Intenta de nuevo.');
  }
}