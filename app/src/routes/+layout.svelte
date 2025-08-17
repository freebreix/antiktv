<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="min-h-screen bg-neutral-950 text-neutral-100">
  <header class="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur border-b border-neutral-800">
    <div class="max-w-6xl mx-auto p-3 flex items-center gap-3">
      <div class="font-semibold">AntikTV</div>
      <nav class="ml-auto text-sm opacity-80">SvelteKit + Tailwind v4 + Bits UI + HLS.js</nav>
    </div>
  </header>
  <main class="max-w-6xl mx-auto p-3">
    {@render children?.()}
  </main>
</div>
