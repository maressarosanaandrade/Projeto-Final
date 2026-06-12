<template>
  <nav class="top-navbar">
    <div class="nav-logo">
      <span>Unripe Apples</span>
    </div>
    <div class="nav-links">
      <button class="nav-btn active">Espaço de Registro</button>
      <button class="nav-btn" @click="irParaManual">Guia de Foco</button>
      <button class="nav-btn" @click="irParaConquistas">Conquistas</button>
      <button class="nav-btn btn-logout" @click="fazerLogout">Sair</button>
    </div>
  </nav>

  <div class="dashboard-container">
    <div class="left-column">
      
      <div class="apple-status">
        <img :src="estadoEvolucao.imagem" :alt="estadoEvolucao.titulo" class="status-img">
      </div>
      
      <div class="status-box">
        <h3>Olá, {{ userName }}</h3>
        
        <p class="level-indicator">{{ estadoEvolucao.titulo }}</p>
        
        <div class="stats-card">
          <p class="stat-line item-tela"><span>Tempo fora das Telas:</span> <strong>{{ totalHoras }}h</strong></p>
          <p class="stat-line item-ponto"><span>Pontos:</span> <strong>{{ totalFatias }}</strong></p>
        </div>
        
        <div class="progress-container">
          <div class="progress-label"> Progresso ({{ progressoPorcentagem }}%)</div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="{ width: progressoPorcentagem + '%' }"></div>
          </div>
        </div>
        
      </div>
    </div>

    <div class="right-column">
      <form class="study-form-card" @submit.prevent="salvarMomento">
        <h3>O que você viveu longe das telas hoje?</h3>
        <div class="form-inputs">
          <input type="text" placeholder="Ex: Joguei xadrez, organizei meu quarto..." class="input-task" v-model="novaTarefa" required />
          
          <select class="select-category" v-model="categoriaSelecionada" required>
            <option value="" disabled selected>Escolha uma categoria</option>
            <option value="Estudo">🗒️ Estudo</option>
            <option value="Leitura">🔖 Leitura</option>
            <option value="Esporte">🏐 Esporte</option>
            <option value="Trabalho">💼 Trabalho</option>
            <option value="Lazer">🎨 Lazer</option>
            <option value="Outro"> + Outro</option>
          </select>

          <select class="select-time" v-model.number="tempoSelecionado">
            <option :value="5">5 min (Foco relâmpago)</option>
            <option :value="15">15 min (Foco rápido)</option>
            <option :value="30">30 min (Foco padrão)</option>
            <option :value="45">45 min (Foco estendido)</option>
            <option :value="60">1 hora (Foco profundo)</option>
            <option :value="90">1h 30min (Foco imersivo)</option>
            <option :value="120">2 horas (Super foco)</option>
            <option :value="180">3 horas (Mestre do foco)</option>
            <option :value="240">4 horas (Imparável)</option>
          </select>
        </div>
        <button type="submit" class="btn-add">Salvar momento</button>
      </form>

      <div class="cards-list">
        <h3>Momentos registrados</h3>
        <div v-for="momento in momentos" :key="momento.id" class="notebook-line-card">
          
          <div v-if="momentoSendoEditado === momento.id" class="edit-mode-container">
            <input type="text" v-model="textoEditado" class="input-edit" />
            
            <select v-model="categoriaEditada" class="select-edit">
              <option value="Estudo">📚 Estudo</option>
              <option value="Leitura">📖 Leitura</option>
              <option value="Esporte">🚴 Esporte</option>
              <option value="Trabalho">💼 Trabalho</option>
              <option value="Lazer">🎨 Lazer</option>
              <option value="Outro">✨ Outro</option>
            </select>

            <select v-model.number="tempoEditado" class="select-edit">
              <option :value="5">5 min</option>
              <option :value="15">15 min</option>
              <option :value="30">30 min</option>
              <option :value="45">45 min</option>
              <option :value="60">1 hora</option>
              <option :value="90">1h 30min</option>
              <option :value="120">2 horas</option>
              <option :value="180">3 horas</option>
              <option :value="240">4 horas</option>
            </select>
            <div class="edit-actions">
              <button class="btn-save-edit" @click="salvarEdicao(momento.id)">Confirmar</button>
              <button class="btn-cancel-edit" @click="cancelarEdicao">Cancelar</button>
            </div>
          </div>

          <div v-else class="card-content-wrapper">
            <div class="card-content">
              <div class="task-details">
                <span class="task-text">
                  <span class="category-badge">{{ momento.categoria || 'Outro' }}</span> 
                  {{ momento.tarefa }}
                </span>
                <span class="task-time">
                  {{ formatarTempo(momento.minutos) }} dedicados • 
                  <span class="task-date">{{ formatarData(momento.criadoEm) }}</span>
                </span>
              </div>
            </div>
            <div class="actions">
              <button class="btn-action" @click="ativarEdicao(momento)">Editar</button>
              <button class="btn-action" @click="deletarMomento(momento.id)">Excluir</button>
            </div>
          </div>

        </div>
        <p v-if="momentos.length === 0" class="empty-list">Nenhum momento registrado. Que tal começar agora?</p>
      </div>
    </div>
  </div>
  <div v-if="mostrarJanelaExcluir" class="janela-alerta-fundo">
    <div class="janela-alerta-card">
      <h4>Deseja mesmo excluir?</h4>
      <p>Essa ação não poderá ser desfeita.</p>
      <div class="janela-alerta-botoes">
        <button class="btn-confirmar-excluir" @click="confirmarDeletar">Sim, excluir</button>
        <button class="btn-cancelar-excluir" @click="mostrarJanelaExcluir = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase/config.js'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, orderBy, updateDoc, Timestamp } from 'firebase/firestore'

const router = useRouter()
const userName = ref('Cultivador')
const userId = ref(null)
const novaTarefa = ref('')
const categoriaSelecionada = ref('') 
const tempoSelecionado = ref(30)
const momentos = ref([])
const mostrarJanelaExcluir = ref(false)
const idParaDeletar = ref(null)

const momentoSendoEditado = ref(null)
const textoEditado = ref('')
const categoriaEditada = ref('Outro') 
const tempoEditado = ref(30)

let unsubscribe = null

const colocarValoresSeguros = (valor) => {
  const n = Number(valor)
  return isNaN(n) ? 0 : n
}

const formatarTempo = (minutos) => {
  if (minutos < 60) return `${minutos} minutos`
  const horas = Math.floor(minutos / 60)
  const minRestantes = minutos % 60
  return minRestantes > 0 ? `${horas}h ${minRestantes}min` : `${horas}h`
}

const formatarData = (timestamp) => {
  if (!timestamp) return ''
  const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const ativarEscutaBanco = (uid) => {
  const q = query(
    collection(db, 'momentos'), 
    where('userId', '==', uid),
    orderBy('criadoEm', 'desc')
  )

  if (unsubscribe) unsubscribe()

  unsubscribe = onSnapshot(q, (snapshot) => {
    momentos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }, (error) => {
    console.error("Erro no onSnapshot:", error)
  })
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid
      
      if (user.displayName && user.displayName.trim() !== "") {
        userName.value = user.displayName
      } else if (user.email) {
        userName.value = user.email.split('@')[0]
      } else {
        userName.value = 'Cultivador'
      }

      ativarEscutaBanco(user.uid)

    } else {
      if (unsubscribe) unsubscribe()
      router.push('/auth')
    }
  })
})

const salvarMomento = async () => {
  if (!userId.value) return
  const fatiasCalculadas = Number(tempoSelecionado.value) / 15
  try {
    const novoDoc = {
      userId: userId.value,
      tarefa: novaTarefa.value,
      categoria: categoriaSelecionada.value || 'Outro', 
      minutos: Number(tempoSelecionado.value),
      fatias: fatiasCalculadas,
      criadoEm: Timestamp.now() 
    }
    
    const docRef = await addDoc(collection(db, 'momentos'), novoDoc)
    
    momentos.value.unshift({ id: docRef.id, ...novoDoc })

    novaTarefa.value = ''
    categoriaSelecionada.value = ''
    tempoSelecionado.value = 30
  } catch (error) {
    console.error(error)
  }
}

const deletarMomento = (id) => {
  if (!id) return
  idParaDeletar.value = id
  mostrarJanelaExcluir.value = true 
}

const confirmarDeletar = async () => {
  try { 
    await deleteDoc(doc(db, 'momentos', idParaDeletar.value)) 
    momentos.value = momentos.value.filter(m => m.id !== idParaDeletar.value)
    mostrarJanelaExcluir.value = false 
    idParaDeletar.value = null 
  } catch (error) { 
    console.error(error) 
  }
}

const ativarEdicao = (momento) => {
  momentoSendoEditado.value = momento.id
  textoEditado.value = momento.tarefa
  categoriaEditada.value = momento.categoria || 'Outro'
  tempoEditado.value = colocarValoresSeguros(momento.minutos) || 30
}

const cancelarEdicao = () => {
  momentoSendoEditado.value = null
  textoEditado.value = ''
}

const salvarEdicao = async (id) => {
  if (!textoEditado.value.trim() || !id) return
  const fatiasCalculadas = Number(tempoEditado.value) / 15
  try {
    const momentoRef = doc(db, 'momentos', id)
    await updateDoc(momentoRef, {
      tarefa: textoEditado.value,
      categoria: categoriaEditada.value,
      minutos: Number(tempoEditado.value),
      fatias: fatiasCalculadas
    })
    
    const index = momentos.value.findIndex(m => m.id === id)
    if (index !== -1) {
      momentos.value[index].tarefa = textoEditado.value
      momentos.value[index].categoria = categoriaEditada.value
      momentos.value[index].minutos = Number(tempoEditado.value)
      momentos.value[index].fatias = fatiasCalculadas
    }

    cancelarEdicao()
  } catch (error) {
    console.error(error)
  }
}

const totalFatias = computed(() => {
  const pontos = momentos.value.reduce((soma, m) => soma + colocarValoresSeguros(m.fatias), 0)
  return Math.round(pontos)
})

const totalHoras = computed(() => {
  const minutesTotais = momentos.value.reduce((soma, m) => soma + colocarValoresSeguros(m.minutos), 0)
  return (minutesTotais / 60).toFixed(1)
})

const progressoPorcentagem = computed(() => {
  const metaMinutos = 600
  const minutosAtuais = momentos.value.reduce((soma, m) => soma + colocarValoresSeguros(m.minutos), 0)
  const porcentagem = Math.round((minutosAtuais / metaMinutos) * 100)
  return porcentagem > 100 ? 100 : porcentagem
})

const estadoEvolucao = computed(() => {
  const horas = parseFloat(totalHoras.value)
  if (horas < 5.0) {
    return { titulo: 'Maçã Verde • Hábitos em crescimento', imagem: '/src/assets/apple-verde.png' }
  } else { 
    return { titulo: 'Maçã Madura • Foco consolidado!', imagem: '/src/assets/apple.png' }
  }
})

const irParaManual = () => router.push('/manual')
const irParaConquistas = () => router.push('/conquistas')

const fazerLogout = async () => {
  if (unsubscribe) unsubscribe()
  await signOut(auth)
  router.push('/')
}
</script>

<style scoped>
.top-navbar { display: flex; justify-content: space-between; align-items: center; width: 100%; height: 60px; background-color: #ffffff; padding: 0 40px; border-bottom: 1px solid #e1e7dc; box-sizing: border-box; }
.nav-logo { font-size: 1.15rem; font-weight: 700; color: #283618; }
.nav-links { display: flex; gap: 20px; }
.nav-btn { background: none; border: none; font-size: 0.95rem; font-weight: 500; color: #666; cursor: pointer; padding: 5px 10px; transition: color 0.2s ease; }
.nav-btn:hover { color: #283618; }
.nav-btn.active { color: #a3b18a; font-weight: 600; }
.btn-logout { color: #bc6c25; }
.btn-logout:hover { color: #8b4f19; }
.dashboard-container { display: flex; width: 100%; height: calc(100vh - 60px); background-color: #D9E9CF; }
.left-column { width: 32%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; border-right: 1px solid #e1e7dc; background: #ffffff; padding: 40px; overflow-y: auto; }
.apple-status { width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; }
.status-img { width: 100%; height: 100%; object-fit: contain; }
.status-box { width: 100%; }
.status-box h3 { font-size: 1.6rem; color: #283618; margin: 0; font-weight: 700; text-align: center; }
.level-indicator { font-size: 0.95rem; color: #bc6c25; font-style: italic; margin-top: 4px; margin-bottom: 25px; text-align: center; }
.stats-card { background: #fdfdfb; border: 1px solid #e9edc9; border-radius: 12px; padding: 15px 20px; margin-bottom: 25px; }
.stat-line { font-size: 0.95rem; color: #555; margin: 12px 0; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.stat-line span { display: flex; align-items: center; gap: 8px; }
.stat-line span::before { content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
.item-tela span::before { background-color: #bc6c25; }
.item-ponto span::before { background-color: #a3b18a; }
.progress-container { width: 100%; margin-bottom: 20px; }
.progress-label { font-size: 0.8rem; color: #777; margin-bottom: 6px; text-align: left; }
.progress-bar-bg { width: 100%; height: 12px; background-color: #e9edc9; border-radius: 20px; overflow: hidden; }
.progress-bar-fill { height: 100%; background-color: #a3b18a; border-radius: 20px; transition: width 0.4s ease; }
.right-column { width: 68%; padding: 50px; display: flex; flex-direction: column; gap: 35px; overflow-y: auto; }
.study-form-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(40, 54, 24, 0.03); display: flex; flex-direction: column; gap: 20px; }
.study-form-card h3, .cards-list h3 { font-size: 1.25rem; color: #283618; margin: 0; font-weight: 600; }
.form-inputs { display: flex; gap: 15px; flex-wrap: wrap; }
.input-task { flex: 2; min-width: 200px; padding: 14px; border-radius: 10px; border: 1px solid #d1d7cd; font-size: 0.95rem; outline: none; }
.select-category, .select-time { flex: 1; min-width: 150px; padding: 14px; border-radius: 10px; border: 1px solid #d1d7cd; background-color: #ffffff; font-size: 0.95rem; color: #444; outline: none; cursor: pointer; }
.input-task:focus, .select-category:focus, .select-time:focus { border-color: #a3b18a; }
.category-badge { background-color: #e9edc9; color: #283618; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; margin-right: 8px; text-transform: uppercase; vertical-align: middle; }
.task-date { color: #999; font-style: normal; margin-left: 5px; }
.btn-add { padding: 14px; background: #a3b18a; color: white; border: none; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background-color 0.2s ease; }
.btn-add:hover { background: #8fa273; }
.cards-list { display: flex; flex-direction: column; gap: 15px; }
.notebook-line-card { background: white; padding: 18px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 12px rgba(40, 54, 24, 0.02); border-bottom: 2px solid #e3edf7; }
.card-content-wrapper { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.card-content { display: flex; align-items: center; gap: 15px; }
.task-details { display: flex; flex-direction: column; gap: 4px; }
.task-text { font-size: 1rem; color: #333; font-weight: 500; }
.task-time { font-size: 0.85rem; color: #bc6c25; font-style: italic; }
.actions { display: flex; gap: 8px; }
.btn-action { background: #fafbfc; border: 1px solid #e1e7dc; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; color: #555; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease; }
.btn-action:hover { background: #f4f6f0; color: #283618; }
.edit-mode-container { display: flex; gap: 10px; width: 100%; align-items: center; flex-wrap: wrap; }
.input-edit { flex: 2; min-width: 150px; padding: 8px; border-radius: 6px; border: 1px solid #d1d7cd; font-size: 0.95rem; }
.select-edit { flex: 1; min-width: 100px; padding: 8px; border-radius: 6px; border: 1px solid #d1d7cd; background: white; font-size: 0.95rem; }
.edit-actions { display: flex; gap: 5px; }
.btn-save-edit, .btn-cancel-edit { border: none; background: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; padding: 5px; }
.btn-save-edit { color: #283618; }
.btn-cancel-edit { color: #bc6c25; }
.empty-list { font-size: 0.95rem; color: #777; font-style: italic; text-align: center; margin-top: 20px; }
.janela-alerta-fundo { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(40, 54, 24, 0.15); display: flex; align-items: center; justify-content: center; z-index: 999;}
.janela-alerta-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 10px 30px rgba(40, 54, 24, 0.08); text-align: center; max-width: 350px; border-bottom: 3px solid #e3edf7;}
.janela-alerta-card h4 { color: #283618; margin: 0 0 10px 0; font-size: 1.2rem; font-weight: 600; }
.janela-alerta-card p { color: #777; font-size: 0.9rem; margin-bottom: 20px; }
.janela-alerta-botoes { display: flex; gap: 10px; justify-content: center; }
.btn-confirmar-excluir { background: #bc6c25; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-cancelar-excluir { background: #fafbfc; border: 1px solid #d1d7cd; padding: 10px 20px; border-radius: 8px; cursor: pointer; color: #555; font-weight: 500; }
</style>