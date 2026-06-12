<template> 
  <div class="app-layout">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

body, html, #app, .app-layout {
  width: 100%;
  height: 100vh;
  background-color: #f4f6f0;
}
</style>