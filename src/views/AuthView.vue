<template>
  <div class="auth-container">
    <div class="form-column">
      <div class="notebook-card">
        <div class="navigation-row">
          <button class="btn-back" @click="voltarParaHome">← Voltar para o início</button>
        </div>
        <div class="apple-badge">
          <img src="/src/assets/icone-apple.png" alt="Selo Unripe Apples" class="badge-img">
        </div>
        <h2>{{ isLogin ? 'LOGIN' : 'CADASTRO' }}</h2>
        <p class="form-subtitle">{{ isLogin ? 'Identifique-se para acessar seu espaço de registro' : 'Crie o seu diário de hábitos' }}</p>
        <form @submit.prevent="handleSubmit">
          <div class="input-group" v-if="!isLogin">
            <input type="text" placeholder="Como quer ser chamado?" v-model="displayName" required />
          </div>
          <div class="input-group">
            <input type="email" placeholder="Seu e-mail" v-model="email" required />
          </div>
          <div class="input-group">
            <input type="password" placeholder="Sua senha" v-model="password" required />
          </div>
          <button type="submit" class="btn-submit">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</button>
        </form>
        <div class="toggle-mode">
          <p v-if="isLogin">Novo por aqui? <span class="toggle-link" @click="isLogin = false">Criar uma conta</span></p>
          <p v-else>Já possui conta? <span class="toggle-link" @click="isLogin = true">Fazer login</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase/config.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const router = useRouter()
const isLogin = ref(true)
const displayName = ref('')
const email = ref('')
const password = ref('')

const voltarParaHome = () => {
  router.push('/')
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      router.push('/dashboard')
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
      const user = userCredential.user
      await updateProfile(user, { displayName: displayName.value })
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nome: displayName.value,
        email: email.value,
        criadoEm: new Date()
      })
      alert('Conta criada com sucesso! Agora acesse o seu espaço.')
      isLogin.value = true
      email.value = ''
      password.value = ''
      displayName.value = ''
    }
  } catch (error) {
    console.error(error)
    alert('Erro na autenticação: ' + error.message)
  }
}
</script>

<style scoped>
.auth-container { display: flex; align-items: center; justify-content: center;width: 100%; height: 100vh; background-image: url('/src/assets/fundo.jpg'); background-repeat: no-repeat; background-size: cover; background-position: center; }
.form-column { width: 100%; max-width: 550px; display: flex; justify-content: center; padding: 20px; }
.notebook-card { width: 100%; max-width: 550px; background: #ffffff; border-radius: 24px; padding: 50px 40px; box-shadow: 0 8px 30px rgba(40, 54, 24, 0.05); position: relative; background-image: linear-gradient(#e3edf7 1px, transparent 1px), linear-gradient(90deg, #fbc4c4 1px, transparent 1px); background-size: 100% 32px, 100% 100%; background-position: 0 28px, 40px 0; }
.navigation-row { width: 100%; display: flex; justify-content: flex-start; margin-bottom: 10px; }
.btn-back { background: none; border: none; color: #bc6c25; font-weight: 600; cursor: pointer; font-size: 0.9rem; padding: 0; }
.btn-back:hover { text-decoration: underline; }
.apple-badge { width: 150px; height: 150px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; }
.badge-img { width: 100%; height: 100%; object-fit: contain; }
h2 { font-size: 2rem; color: #283618; margin: 0; font-weight: 700; text-align: center; }
.form-subtitle { font-size: 0.95rem; color: #bc6c25; text-align: center; margin-top: 5px; margin-bottom: 20px; font-style: italic; }
form { display: flex; flex-direction: column; gap: 14px; }
input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #d1d7cd; background-color: #ffffff; font-size: 1rem; color: #333; box-sizing: border-box; outline: none; transition: border-color 0.2s ease; }
input:focus { border-color: #a3b18a; }
.btn-submit { padding: 14px; font-size: 1rem; font-weight: 600; color: white; background-color: #a3b18a; border: none; border-radius: 12px; cursor: pointer; margin-top: 10px; transition: background-color 0.2s ease; }
.btn-submit:hover { background-color: #8fa273; }
.toggle-mode { margin-top: 30px; text-align: center; }
.toggle-mode p { font-size: 0.95rem; color: #666; }
.toggle-link { color: #bc6c25; font-weight: 600; cursor: pointer; text-decoration: underline; margin-left: 5px; }
.toggle-link:hover { color: #8b4f19; }
</style>