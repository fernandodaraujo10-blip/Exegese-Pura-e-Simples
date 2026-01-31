import { GoogleGenAI } from "@google/genai";
import { TheologyLine, ExegesisModule } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExegesis = async (
  reference: string,
  theology: TheologyLine,
  module: ExegesisModule
): Promise<string> => {
  const client = getClient();
  if (!client) return "Erro: Chave de API não configurada. Contate o administrador.";

  let prompt = `Atue como um erudito bíblico sênior e especialista em teologia.
  
  Texto Base: "${reference}"
  Linha Teológica Obrigatória: ${theology}
  Tipo de Estudo: ${module}
  
  Instruções Específicas:
  `;

  switch (module) {
    case ExegesisModule.ORIGINALS:
      prompt += "Analise as palavras-chave no original (Hebraico ou Grego). Forneça transliteração, morfologia e significado raiz.";
      break;
    case ExegesisModule.FULL_EXEGESIS:
      prompt += "Forneça uma exegese completa: Contexto histórico, literário, análise versículo por versículo e aplicação teológica.";
      break;
    case ExegesisModule.HOMILETIC:
      prompt += "Crie um esboço de pregação estruturado: Título, Introdução, Tópicos principais (com aliteração se possível) e Conclusão prática.";
      break;
    case ExegesisModule.TEACHER:
      prompt += "Prepare uma aula para Escola Bíblica Dominical. Inclua: Objetivo da aula, pontos de ensino, dinâmicas e perguntas para discussão.";
      break;
    case ExegesisModule.DICTIONARY:
      prompt += "Liste as palavras mais importantes do texto e forneça definições profundas baseadas em dicionários bíblicos respeitados.";
      break;
    case ExegesisModule.SYNTAX:
      prompt += "Analise a estrutura gramatical e sintática das frases. Identifique verbos principais, conectivos e fluxo de pensamento.";
      break;
  }

  prompt += `\n\nMantenha uma linguagem acadêmica porém acessível. Responda em Markdown formatado.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } // Enable some thinking for better exegesis
      }
    });
    
    return response.text || "Não foi possível gerar o estudo. Tente novamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao comunicar com a inteligência artificial. Verifique sua conexão.";
  }
};