<template>
  <div class="home-container">
    <div class="main-card">
      
      <div class="apple-container">  
        <img src="/src/assets/apple.png" alt="Maçã Imatura" class="apple-img">
      </div>

      <div class="welcome-content">
        <h1>Unripe Apples</h1>
        <p class="subtitle">O ritmo dos seus estudos</p>
        
        <p class="description">
          Registre suas horas dedicadas aos estudos, hobbies e passatempos offline. Cada momento longe das telas se transforma em progresso no seu painel, onde você acompanha sua evolução e vê sua maçã mudar de verde a madura conforme seus novos hábitos ganham consistência.
        </p>
        
        <button class="btn-start" @click="começarAventura">
          COMEÇAR
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const começarAventura = () => {
  router.push('/auth')
}
</script>

<style scoped>
.home-container { display: flex; align-items: center; justify-content: center; width: 100%; height: 100vh; background-image: url('/src/assets/fundo.jpg'); background-repeat: no-repeat; background-size: cover; background-position: center; }
.main-card { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 550px; padding: 50px 40px; background: #ffffff; border-radius: 24px; box-shadow: 0 8px 30px rgba(40, 54, 24, 0.05); }
.apple-container { width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.apple-img { width: 100%; height: 100%; object-fit: contain; }
h1 { font-size: 2.8rem; color: #283618; margin: 0; font-weight: 700; letter-spacing: -0.5px; }
.subtitle { font-size: 1.15rem; color: #bc6c25; font-style: italic; margin-top: 4px; margin-bottom: 25px; }
.description { font-size: 1rem; color: #666; line-height: 1.6; margin-bottom: 35px; padding: 0 10px; }
.btn-start { padding: 14px 36px; font-size: 1rem; font-weight: 600; color: white; background-color: #a3b18a; border: none; border-radius: 12px; cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease; }
.btn-start:hover { background-color: #8fa273; }
.btn-start:active { transform: scale(0.98); }
</style>