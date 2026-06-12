<template>
  <div class="achievements-container">
    <div class="notebook-page">
      
      <div class="navigation-row">
        <button class="btn-back" @click="voltarParaDashboard">← Voltar para o Espaço</button>
      </div>

      <div class="achievements-header">
        <h2>Conquistas</h2>
        <p class="subtitle">Acompanhe o amadurecimento dos seus hábitos</p>
      </div>

      <hr class="notebook-line" />

      <div class="trophy-room">
        <div 
          v-for="conquista in listaConquistas" 
          :key="conquista.id" 
          class="badge-card"
          :class="{ 'earned-card': conquista.desbloqueada }"
        >
          <div class="badge-icon-wrapper">
            <span class="badge-icon">{{ conquista.desbloqueada ? conquista.icone : '🔒' }}</span>
          </div>
          <div class="badge-info">
            <h3>{{ conquista.titulo }}</h3>
            <p>{{ conquista.descricao }}</p>
            <span class="status-tag" :class="conquista.desbloqueada ? 'tag-earned' : 'tag-locked'">
              {{ conquista.desbloqueada ? 'Alcançado' : 'Bloqueado' }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase/config.js'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const router = useRouter()
const momentos = ref([])

const listaConquistas = ref([
  { id: 1, titulo: 'Primeiro Broto', descricao: 'Você deu o primeiro passo e registrou um momento offline.', icone: '🏅', desbloqueada: false },
  { id: 2, titulo: 'Cultivador Ativo', descricao: 'Somou sua primeira hora completa de foco no mundo real.', icone: '🌳', desbloqueada: false },
  { id: 3, titulo: 'Leitor Analógico', descricao: 'Registrou pelo menos 2 momentos dedicados à categoria Leitura.', icone: '📖', desbloqueada: false },
  { id: 4, titulo: 'Mergulho Profundo', descricao: 'Completou um bloco único de Super Foco de 2 horas ou mais.', icone: '⚡', desbloqueada: false },
  { id: 5, titulo: 'Grande Pomar', descricao: 'Alcançou a marca de 5 horas acumuladas longe das telas.', icone: '🍎', desbloqueada: false },
  { id: 6, titulo: 'Foco Inabalável', descricao: 'Alcançou a marca de 10 horas totais de presença no mundo físico.', icone: '👑', desbloqueada: false },
  { id: 7, titulo: 'Mestre da Presença', descricao: 'Alcançou o topo histórico acumulando 20 horas offline.', icone: '✨', desbloqueada: false }
])

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(collection(db, 'momentos'), where('userId', '==', user.uid))
      onSnapshot(q, (snapshot) => {
        momentos.value = snapshot.docs.map(doc => doc.data())
        calcularConquistas()
      })
    } else {
      router.push('/auth')
    }
  })
})

const calcularConquistas = () => {
  const totalFatias = momentos.value.reduce((soma, m) => soma + (m.fatias || 0), 0)
  const minutesTotais = momentos.value.reduce((soma, m) => soma + (m.minutos || 0), 0)
  const totalHoras = parseFloat((minutesTotais / 60).toFixed(1))
  
  const contagemLeitura = momentos.value.filter(m => m.categoria === 'Leitura').length
  const temSuperFoco = momentos.value.some(m => (m.minutos || 0) >= 120)

  listaConquistas.value[0].desbloqueada = totalFatias >= 1
  listaConquistas.value[1].desbloqueada = totalHoras >= 1.0
  listaConquistas.value[2].desbloqueada = contagemLeitura >= 2
  listaConquistas.value[3].desbloqueada = temSuperFoco
  listaConquistas.value[4].desbloqueada = totalHoras >= 5.0
  listaConquistas.value[5].desbloqueada = totalHoras >= 10.0
  listaConquistas.value[6].desbloqueada = totalHoras >= 20.0
}

const voltarParaDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.achievements-container { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%; min-height: 100vh; height: 100%; overflow-y: auto; background-color: #D9E9CF; padding: 50px 20px; box-sizing: border-box; }
.notebook-page { width: 100%; max-width: 650px; background: #ffffff; border-radius: 24px; padding: 40px 50px; box-shadow: 0 4px 20px rgba(40, 54, 24, 0.03); box-sizing: border-box; background-image: linear-gradient(#e3edf7 1px, transparent 1px); background-size: 100% 32px; background-position: 0 30px; }
.navigation-row { width: 100%; display: flex; justify-content: flex-start; margin-bottom: 15px; }
.btn-back { background: none; border: none; color: #bc6c25; font-weight: 600; cursor: pointer; font-size: 0.95rem; padding: 0; transition: color 0.2s ease; }
.btn-back:hover { color: #8b4f19; }
.achievements-header { text-align: center; margin-bottom: 20px; }
h2 { font-size: 2rem; color: #283618; margin: 0; font-weight: 700; }
.subtitle { font-size: 0.95rem; color: #bc6c25; font-style: italic; margin: 5px 0 0 0; }
.notebook-line { border: none; height: 2px; background-color: #fbc4c4; margin-bottom: 35px; }
.trophy-room { display: flex; flex-direction: column; gap: 20px; }
.badge-card { display: flex; align-items: center; gap: 20px; background-color: #fafbfc; border: 1px solid #e1e7dc; border-radius: 16px; padding: 20px; transition: all 0.3s ease; opacity: 0.6; }
.earned-card { background-color: #ffffff; border: 1px solid #a3b18a; box-shadow: 0 4px 15px rgba(163, 177, 138, 0.06); opacity: 1; }
.badge-icon-wrapper { width: 55px; height: 55px; background-color: #f4f6f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #e1e7dc; flex-shrink: 0; }
.earned-card .badge-icon-wrapper { background-color: #e9edc9; border-color: #a3b18a; }
.badge-icon { font-size: 1.6rem; display: flex; align-items: center; justify-content: center; }
.badge-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.badge-info h3 { font-size: 1.1rem; color: #283618; margin: 0; font-weight: 600; }
.badge-info p { font-size: 0.9rem; color: #666; margin: 0; line-height: 1.4; }
.status-tag { display: inline-block; align-self: flex-start; font-size: 0.75rem; font-weight: 600; padding: 3px 8px; border-radius: 20px; margin-top: 4px; }
.tag-locked { background-color: #e1e7dc; color: #777; }
.tag-earned { background-color: #a3b18a; color: white; }
</style>