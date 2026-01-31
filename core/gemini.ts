import { GoogleGenerativeAI } from "@google/generative-ai";
import { TheologyLine, ExegesisModule } from './types';

const getClient = () => {
  // Garantir que a chave está sendo lida corretamente no ambiente Vite
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyDOCwv2vT9OqyUO0fahCNRVIVAjJ1Rp6H8'; // Fallback direto para a chave enviada

  if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
    console.error("Gemini API Key missing or invalid");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// --- CHAT AI (BIBLE HELP) ---
export const askBibleAI = async (
  question: string,
  theology: TheologyLine,
  persona: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "Erro: Chave de API não configurada.";

  // Configuração da Persona
  let roleInstruction = "";

  if (persona === 'Conselheiro') {
    roleInstruction = `
      ATUE COMO UM CONSELHEIRO PASTORAL BÍBLICO E ERUDITO.
      Sua linha teológica é: ${theology}.
      
      Diretrizes:
      1. Use uma linguagem acolhedora, sóbria e profundamente baseada nas Escrituras.
      2. Evite psicologismo moderno; foque na teologia bíblica da alma e do sofrimento.
      3. Seja tradicional e reverente. Use termos como 'providência', 'santificação', 'comunhão'.
    `;
  } else if (persona === 'Professor') {
    roleInstruction = `
      ATUE COMO UM PROFESSOR DE TEOLOGIA SISTEMÁTICA E EXEGESE.
      Sua linha teológica é: ${theology}.
      
      Diretrizes:
      1. Estruture a resposta com profundidade acadêmica e clareza didática.
      2. Use referências históricas (Credos, Confissões de Fé, Pais da Igreja).
      3. Mantenha um tom solene e intelectualmente rigoroso.
    `;
  } else {
    roleInstruction = `
      ATUE COMO UM TEÓLOGO REFORMADO E ERUDITO.
      Sua base teológica é: ${theology}.
      
      Diretrizes:
      1. Responda com densidade teológica, citando autores clássicos se pertinente.
      2. Seja sóbrio, preciso e evite respostas superficiais.
      3. Aprofunde-se no significado dos termos originais e no contexto histórico-redentor.
    `;
  }

  const prompt = `
    ${roleInstruction}
    
    INSTRUÇÕES GERAIS OBRIGATÓRIAS:
    1. Responda em Português do Brasil com um vocabulário rico e preciso.
    2. Seja breve mas denso.
    3. NUNCA mencione que você é uma IA.
    4. A Bíblia é sua autoridade suprema e final.
    
    PERGUNTA DO USUÁRIO: "${question}"
  `;

  try {
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    return result.response.text() || "Não foi possível processar sua dúvida teológica.";
  } catch (error) {
    console.error("AI Error:", error);
    return "O servidor de conhecimento teológico está temporariamente indisponível.";
  }
};

// --- EXEGESIS GENERATOR ---
export const generateExegesis = async (
  reference: string,
  theology: TheologyLine,
  module: ExegesisModule
): Promise<string> => {
  const client = getClient();
  if (!client) return "Erro: Chave de API não configurada. Contate o ADMIN.";

  let systemContext = `Você é um erudito bíblico sênior com doutorado em línguas originais e teologia histórica.
  Sua perspectiva é estritamente: ${theology}.
  Seu tom deve ser: Tradicional, Sóbrio, Acadêmico e Profundo.`;

  const styleGuide = `
    DIRETRIZES DE EXEGESE:
    1. FOCO NA PROFUNDIDADE: Evite o óbvio. Explore nuances do texto.
    2. TRADIÇÃO: Respeite a ortodoxia clássica e os métodos gramático-históricos.
    3. FORMATO: Use Markdown elegante, com negritos para ênfase e listas para clareza.
    4. ORIGINAIS: Sempre que possível, mencione o sentido das palavras no Grego ou Hebraico.
  `;

  let taskInstruction = "";
  switch (module) {
    case ExegesisModule.ORIGINALS:
      taskInstruction = `
        Realize uma análise interlinear e léxica profunda do texto: "${reference}".
        Para as palavras principais:
        1. Termo no original (Grego/Hebraico com caracteres originais).
        2. Transliteração.
        3. Significado léxico raiz.
        4. Nuance sintática neste verso.
        5. Conexão com o sistema de numeração de Strong (se aplicável).
      `;
      break;
    case ExegesisModule.FULL_EXEGESIS:
      taskInstruction = `
        Produza uma exegese completa de "${reference}":
        - Contexto Histórico-Redentor: Onde este texto se encaixa na história da salvação?
        - Análise Gramático-Histórica: Estrutura do texto e intenção do autor.
        - Desenvolvimento Teológico: Implicações doutrinárias sob a ótica ${theology}.
        - Síntese Acadêmica: Resumo da mensagem central para a igreja hoje.
      `;
      break;
    case ExegesisModule.HOMILETIC:
      taskInstruction = `
        Gere APENAS o ESQUELETO ESTRUTURAL para um sermão.
        Estrutura obrigatória:
        - Tema Sugerido: [Frase curta]
        - Texto Base: ${reference}
        - Divisão 1: [Tópico baseado no texto]
        - Divisão 2: [Tópico baseado no texto]
        - Divisão 3: [Tópico baseado no texto]
        NÃO DESENVOLVA OS PONTOS. NÃO CRIE INTRODUÇÃO. NÃO CRIE CONCLUSÃO.
      `;
      break;
    case ExegesisModule.TEACHER:
      taskInstruction = `
        Crie uma estrutura para aula de Escola Dominical (EBD).
        Estrutura:
        - Tema da Aula
        - Objetivo Didático (O que o aluno deve aprender)
        - Ponto 1: [Ensino]
        - Ponto 2: [Ensino]
        - Ponto 3: [Ensino]
        Sem discorrer sobre o assunto. Apenas a estrutura.
      `;
      break;
    case ExegesisModule.DICTIONARY:
      taskInstruction = `
        Liste 3 a 5 palavras-chave do texto e seus significados teológicos resumidos.
        Estilo de dicionário bíblico. Direto.
      `;
      break;
    case ExegesisModule.SYNTAX:
      taskInstruction = `
        Analise a estrutura das frases.
        - Identifique o verbo principal.
        - Identifique as conexões lógicas (portanto, mas, porque).
        - Explique a relação entre as orações.
        Linguagem técnica de análise sintática.
      `;
      break;
    default:
      taskInstruction = `Realize um estudo profundo de "${reference}" focado em ${module}.`;
  }

  try {
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(`${styleGuide}\n\nTAREFA ESPECÍFICA:\n${taskInstruction}`);
    return result.response.text() || "Erro ao gerar exegese profunda.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Erro ao acessar a biblioteca de conhecimento exegético.";
  }
};