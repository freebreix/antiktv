<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="min-h-screen bg-neutral-950 text-neutral-100">
  <main class="max-w-6xl mx-auto p-3">
    {@render children?.()}
  </main>
</div>
