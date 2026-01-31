# Plano de Implementação: Exegese Pura & Simples

Este documento detalha o roteiro de desenvolvimento para transformar o MVP atual em uma plataforma completa de estudo bíblico profundo, focada em estética premium e profundidade teológica.

## 🏁 Fase 1: Consolidação do Core & Infraestrutura
**Objetivo:** Garantir que a base técnica seja robusta e persistente.

1.  **Migração de Persistência:**
    *   Substituir o `CoreStorage` (LocalStorage) por uma integração real com Firebase Firestore ou Supabase para backup de dados do usuário.
    *   Implementar autenticação real (Google/Email) na tela de `Registration`.
2.  **Gerenciamento de Estado:**
    *   Avaliar introdução de `Zustand` para gerenciar estados globais (Configurações do Admin, Dados do Usuário do Backend).
3.  **SEO & Performance:**
    *   Otimizar tags meta e estrutura de diretórios para visibilidade.

## 🧠 Fase 2: Inteligência Exegética (O Coração do App)
**Objetivo:** Implementar as ferramentas de análise assistida por IA.

1.  **Integração Gemini AI:**
    *   Configurar o `Google Generative AI SDK` com o sistema de prompts definido (Tom reformado, tradicional e profundo).
    *   Criar o endpoint/service de "Análise de Versículo".
2.  **Módulo de Idiomas Originais:**
    *   Implementar visualização interlinear básica para Grego e Hebraico na vista de `Exegesis`.
    *   Conectar com APIs de léxico (ex: Strong's numbers).
3.  **Chat Bible AI:**
    *   Desenvolver interface de chat fluida para perguntas teológicas, com contexto histórico e sistemático.

## 🎨 Fase 3: Experiência Premium & Polimento (UI/UX)
**Objetivo:** Elevar a estética para um nível "State-of-the-Art".

1.  **Micro-interações:**
    *   Adicionar transições de página suaves (Framer Motion).
    *   Animações de feedback em botões e cards (Slight scale & glow).
2.  **Tipografia Dinâmica:**
    *   Permitir que o usuário ajuste o tamanho da fonte e o espaçamento para uma leitura confortável de textos longos.
3.  **Assets Visuais:**
    *   Gerar imagens de alta qualidade para as seções de "Devocional" e "Livros" usando o `generate_image`.

## 🛠️ Fase 4: Administrativo & Comunidade (Escalabilidade)
**Objetivo:** Permitir que o conteúdo seja atualizado sem mexer no código.

1.  **Dashboard Dinâmico:**
    *   Implementar editor para o "Mural de Avisos".
    *   Gerenciamento de usuários e logs de acesso.
2.  **Módulo Social (Comunidade):**
    *   Criar feed de "Estudos Compartilhados".
    *   Integração para envio de notas por WhatsApp ou E-mail.

## 📆 Cronograma de Entrega (Estimado)

| Semana | Milestone | Entregável Principal |
| :--- | :--- | :--- |
| **01** | Infra & Auth | Login real e sincronização de dados. |
| **02** | IA & Exegese | Primeiro módulo de análise assistida funcional. |
| **03** | Conteúdo & UI | Seções de Devocional e Livros integradas. |
| **04** | Launch Ready | Testes de carga, polimento final e deploy. |

---
*Plano gerado por Antigravity AI - 31/01/2026*
