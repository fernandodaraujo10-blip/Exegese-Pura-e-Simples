import { GoogleGenerativeAI } from "@google/generative-ai";
import { TheologyLine, ExegesisModule } from './types';

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY not found in environment variables");
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
  const genAI = getClient();
  if (!genAI) return "Erro: Chave de API não configurada.";

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Configuração da Persona
  let roleInstruction = "";

  if (persona === 'Conselheiro') {
    roleInstruction = `
      ATUE COMO UM CONSELHEIRO PASTORAL BÍBLICO (NÃO PSICÓLOGO).
      Sua linha teológica é: ${theology}.
      
      Diretrizes:
      1. Use uma linguagem acolhedora, paternal e pastoral.
      2. NUNCA use termos clínicos de psicologia (depressão clínica, ansiedade generalizada, etc). Trate como questões da alma/espirituais.
      3. Dê conselhos práticos baseados na Bíblia.
      4. Se a situação for grave (suicídio, abuso), recomende ajuda profissional e pastoral local com amor.
    `;
  } else if (persona === 'Professor') {
    roleInstruction = `
      ATUE COMO UM PROFESSOR DE ESCOLA BÍBLICA DIDÁTICO E ORGANIZADO.
      Sua linha teológica é: ${theology}.
      
      Diretrizes:
      1. Estruture a resposta como um pequeno estudo bíblico.
      2. Use tópicos: Introdução, Pontos Chave e Aplicação.
      3. Seja extremamente didático e educacional.
      4. Cite referências cruzadas se necessário.
    `;
  } else {
    const personaName = persona === 'Teólogo' ? 'Um Teólogo Erudito' : persona;
    roleInstruction = `
      ATUE COMO: ${personaName.toUpperCase()}.
      Sua base teológica é estritamente: ${theology}.
      
      Diretrizes:
      1. Responda com profundidade teológica.
      2. Seja sério, objetivo e doutrinário.
      3. Cite conceitos chave defendidos por esta linha de pensamento.
      4. Mantenha o respeito e a seriedade acadêmica/eclesiástica.
    `;
  }

  const prompt = `
    ${roleInstruction}
    
    INSTRUÇÕES GERAIS OBRIGATÓRIAS:
    1. Responda de forma PESSOAL (Eu...).
    2. Seja BREVE (Máximo de 2 parágrafos densos ou 3 tópicos curtos).
    3. NUNCA mencione que você é uma IA, um robô ou um software.
    4. A Bíblia é sua autoridade final.
    
    PERGUNTA DO USUÁRIO: "${question}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Não entendi. Pode reformular?";
  } catch (error) {
    console.error("AI Error:", error);
    return "Estou sem conexão no momento. Tente novamente em breve.";
  }
};

// --- EXEGESIS GENERATOR ---
export const generateExegesis = async (
  reference: string,
  theology: TheologyLine,
  module: ExegesisModule
): Promise<string> => {
  const genAI = getClient();
  if (!genAI) return "Erro: Chave de API não configurada. Contate o ADMIN.";

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.2,
    }
  });

  let systemContext = "";
  if (theology === TheologyLine.CALVINIST) systemContext = "Adote uma perspectiva estritamente Reformada/Calvinista (Soberania de Deus, TULIP).";
  if (theology === TheologyLine.ARMINIAN) systemContext = "Adote uma perspectiva estritamente Arminiana (Graça Preveniente, Livre Arbítrio).";
  if (theology === TheologyLine.PENTECOSTAL) systemContext = "Adote uma perspectiva estritamente Pentecostal (Atualidade dos dons, Poder do Espírito).";

  const styleGuide = `
    REGRAS DE OURO (OBRIGATÓRIO):
    1. NÃO GERE SERMÃO OU PREGAÇÃO.
    2. NÃO escreva introdução, desenvolvimento e conclusão textual.
    3. NÃO faça aplicações pastorais diretas (ex: "Você deve...", "Deus quer...").
    4. Seja TÉCNICO, ACADÊMICO e OBJETIVO.
    5. Use TÓPICOS e LISTAS (Markdown).
    6. Mantenha o texto CURTO e DIRETO ao ponto.
  `;

  let taskInstruction = "";
  switch (module) {
    case ExegesisModule.ORIGINALS:
      taskInstruction = `
        Analise SOMENTE os termos originais (Hebraico/Grego) mais importantes deste texto.
        Formato obrigatório:
        - [Palavra Original]: [Significado Raiz] -> [Uso neste contexto específico].
        Sem explicações teológicas longas. Apenas análise linguística.
      `;
      break;
    case ExegesisModule.FULL_EXEGESIS:
      taskInstruction = `
        Produza uma análise técnica dividida EXATAMENTE nestes tópicos:
        1. Contexto Histórico (máx 3 linhas)
        2. Contexto Literário (máx 3 linhas)
        3. Análise Teológica (foco na doutrina)
        4. Ênfases Centrais (pontos chave)
        NÃO faça aplicação prática.
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
  }

  const prompt = `
    ATUE COMO UM ERUDITO BÍBLICO E ACADÊMICO SÊNIOR.
    
    TEXTO BÍBLICO ALVO: "${reference}"
    LENTE TEOLÓGICA: ${systemContext}
    
    ${styleGuide}
    
    SUA TAREFA:
    ${taskInstruction}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Ocorreu um erro ao gerar o conteúdo.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Erro de conexão com o servidor de Inteligência Artificial.";
  }
};