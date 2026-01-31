import { GoogleGenerativeAI } from "@google/generative-ai";
import { TheologyLine, ExegesisModule } from './types';

// Helper para obter a chave de API de forma segura no Vite
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyDOCwv2vT9OqyUO0fahCNRVIVAjJ1Rp6H8'; // Fallback emergencial
};

const genAI = new GoogleGenerativeAI(getApiKey());

// --- IA DE CONVERSA (BIBLE AI) ---
export const askBibleAI = async (
  question: string,
  theology: TheologyLine,
  persona: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Você é um ${persona} bíblico na linha teológica ${theology}. Responda com reverência, profundidade e base bíblica total. Nunca diga que é uma IA.`
    });

    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Conversation Error:", error);
    return "Desculpe, tive um problema ao processar sua dúvida na Inteligência Artificial. Por favor, tente novamente em instantes.";
  }
};

// --- IA DE EXEGESE (GERADOR DE ESTUDOS) ---
export const generateExegesis = async (
  reference: string,
  theology: TheologyLine,
  module: ExegesisModule
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Você é um erudito bíblico sênior com doutorado em línguas originais (Grego/Hebraico) e teologia histórica.
            Sua perspectiva é estritamente: ${theology}.
            Instrução: Gere uma exegese profunda, técnica e acadêmica.`
    });

    let prompt = "";

    // Define o prompt baseado no módulo escolhido
    switch (module) {
      case ExegesisModule.ORIGINALS:
        prompt = `Realize uma análise léxica detalhada de "${reference}". Inclua o termo em Grego/Hebraico, transliteração, significado raiz e nuance teológica.`;
        break;
      case ExegesisModule.FULL_EXEGESIS:
        prompt = `Gere uma exegese completa e densa de "${reference}" cobrindo contexto histórico, análise literária e implicações doutrinárias sob a ótica ${theology}.`;
        break;
      case ExegesisModule.HOMILETIC:
        prompt = `Gere apenas o esqueleto estrutural (tópicos principais) para um sermão baseado em "${reference}".`;
        break;
      case ExegesisModule.TEACHER:
        prompt = `Crie um plano de aula pedagógico para ensinar o texto "${reference}" em uma classe de teologia.`;
        break;
      case ExegesisModule.DICTIONARY:
        prompt = `Defina os principais conceitos teológicos presentes em "${reference}" como em um dicionário bíblico erudito.`;
        break;
      case ExegesisModule.SYNTAX:
        prompt = `Analise a estrutura sintática e a lógica gramatical das orações em "${reference}".`;
        break;
      default:
        prompt = `Realize um estudo teológico profundo sobre "${reference}" focado em ${module}.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Resposta vazia da IA");

    return text;
  } catch (error: any) {
    console.error("Gemini Exegesis Error:", error);

    // Mensagem de erro mais clara para o usuário
    if (error?.message?.includes('API_KEY_INVALID')) {
      return "Erro: A chave de API configurada é inválida. Por favor, verifique as configurações no painel admin.";
    }

    return "A Inteligência Artificial não conseguiu gerar o estudo agora. Isso pode ser um problema de conexão ou limite de uso da chave. Tente novamente em alguns segundos.";
  }
};