<template>
  <div class="docs-container">
    <redoc spec-url="/oas3.yaml"></redoc>
  </div>
</template>

<script>
  export default {
    name: "Docs",
    mounted() {
      const script = document.createElement("script")
      script.src = "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"
      script.async = true
      document.body.appendChild(script)
    }
  }
</script>

<style scoped>
  .docs-container {
    background-color: white;
    min-height: 100vh;
  }
</style>