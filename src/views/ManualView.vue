<template>
  <div class="manual-container">
    <div class="notebook-page">
      
      <div class="navigation-row">
        <button class="btn-back" @click="voltarParaMesa">← Voltar para o Espaço</button>
      </div>

      <div class="manual-header">
        <h2>Guia de Foco</h2>
        <p class="subtitle">Como cultivar sua rotina no mundo real</p>
      </div>

      <hr class="notebook-line" />

      <div class="manual-content">
        <section class="topic">
          <h3>
            <svg class="topic-icon" viewBox="0 0 24 24" fill="none" stroke="#a3b18a" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
            Como funcionam os Pontos?
          </h3>
          <p>
            Cada momento que você passa longe do celular ou do computador rende pontos para o seu painel A ideia não é se esgotar, mas sim criar constância. Registre suas atividades de forma leve e acompanhe o crescimento do seu hábito no seu próprio tempo.
          </p>
        </section>

        <section class="topic">
          <h3>
            <svg class="topic-icon" viewBox="0 0 24 24" fill="none" stroke="#bc6c25" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Como escolher seu tempo?
          </h3>
          <ul class="time-list">
            <li><strong>15 a 30 minutos:</strong> Perfeito para pausas rápidas na rotina, ler um capítulo curto ou dar uma arrumada no quarto.</li>
            <li><strong>45 a 60 minutos:</strong> O tempo ideal para focar de verdade em um estudo, avançar um projeto pessoal ou praticar um hobby.</li>
            <li><strong>90 minutos ou mais:</strong> Foco profundo. Excelente para imersões longas. Quando acabar blocos assim, lembre-se de esticar as pernas e descansar a mente.</li>
          </ul>
        </section>

        <section class="topic-suggestions">
          <h3>
            <svg class="topic-icon" viewBox="0 0 24 24" fill="none" stroke="#283618" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            O que fazer?
          </h3>
          <p class="suggestion-notice">
            O foco aqui é simplesmente viver o momento offline. Veja algumas sugestões simples para mudar de ares durante o dia:
          </p>
          
          <div class="suggestions-grid">
            <div class="suggestion-item">
              <strong>Desafios Mentais</strong>
              <span>Jogar uma partida de xadrez em um tabuleiro real, praticar damas ou resolver um Sudoku impresso.</span>
            </div>
            <div class="suggestion-item">
              <strong>Leitura Analógica</strong>
              <span>Ler um livro físico, folhear uma revista ou acompanhar o capítulo de um mangá.</span>
            </div>
            <div class="suggestion-item">
              <strong>Práticas Manuais</strong>
              <span>Desenhar em um bloco de rascunhos, arriscar uma dobradura, cuidar das suas plantas ou organizar gavetas.</span>
            </div>
            <div class="suggestion-item">
              <strong>Pausa Desacelerada</strong>
              <span>Preparar um café ou um chá com calma e sentar perto da janela para tomar, sem notificações por perto.</span>
            </div>
          </div>
        </section>

        <section class="topic">
          <h3>
            <svg class="topic-icon" viewBox="0 0 24 24" fill="none" stroke="#dda15e" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Entendendo seu progresso
          </h3>
          <p>
            Toda jornada começa com uma maçã verde. À medida que você acumula horas de dedicação real no mundo físico, sua pontuação sobe automaticamente. Pouco a pouco, sua rotina ganha consistência e sua maçã amadurece por completo.
          </p>
        </section>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const voltarParaMesa = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.manual-container { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; min-height: 100vh; height: 100%; overflow-y: auto; background-color: #D9E9CF; padding: 50px 20px; box-sizing: border-box; }
.notebook-page { width: 100%; max-width: 650px; background: #ffffff; border-radius: 24px; padding: 40px 50px; box-shadow: 0 4px 20px rgba(40, 54, 24, 0.03); box-sizing: border-box; background-image: linear-gradient(#e3edf7 1px, transparent 1px); background-size: 100% 32px; background-position: 0 30px; }
.navigation-row { width: 100%; display: flex; justify-content: flex-start; margin-bottom: 15px; }
.btn-back { background: none; border: none; color: #bc6c25; font-weight: 600; cursor: pointer; font-size: 0.95rem; padding: 0; transition: color 0.2s ease; }
.btn-back:hover { color: #8b4f19; }
.manual-header { text-align: center; margin-bottom: 20px; }
h2 { font-size: 2rem; color: #283618; margin: 0; font-weight: 700; }
.subtitle { font-size: 0.95rem; color: #bc6c25; font-style: italic; margin: 5px 0 0 0; }
.notebook-line { border: none; height: 2px; background-color: #fbc4c4; margin-bottom: 35px; }
.manual-content { display: flex; flex-direction: column; gap: 32px; }
.topic h3, .topic-suggestions h3 { font-size: 1.2rem; color: #283618; margin: 0 0 12px 0; display: flex; align-items: center; font-weight: 600; }
.topic-icon { width: 20px; height: 20px; margin-right: 10px; flex-shrink: 0; }
.topic p, .topic li, .topic-suggestions p { font-size: 0.95rem; color: #555; line-height: 1.6; }
.time-list { padding-left: 0; margin: 0; list-style-type: none; }
.time-list li { margin-bottom: 12px; padding-left: 15px; position: relative; }
.time-list li::before { content: "•"; color: #a3b18a; font-weight: bold; position: absolute; left: 0; top: 0; }
.topic-suggestions { background-color: #fafbfc; border: 1px solid #e1e7dc; border-radius: 14px; padding: 24px; }
.suggestion-notice { font-size: 0.88rem !important; color: #666 !important; margin: 0 0 18px 0; }
.suggestions-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.suggestion-item { display: flex; flex-direction: column; font-size: 0.95rem; line-height: 1.5; color: #555; }
.suggestion-item strong { color: #283618; font-size: 0.95rem; margin-bottom: 2px; font-weight: 600; }
</style>