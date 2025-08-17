<script lang="ts">
  import { Button } from "bits-ui";
  import { createEventDispatcher } from "svelte";
  type Channel = { id: string; name: string; logo?: string };
  let { items, selectedId } = $props<{
    items: Channel[];
    selectedId: string;
  }>();
  const dispatch = createEventDispatcher<{ select: string }>();
  function emitSelect(id: string) {
    dispatch("select", id);
  }
  function onClick(ev: MouseEvent, id: string) {
    ev.preventDefault();
    emitSelect(id);
  }
  function onKeyDown(ev: KeyboardEvent, id: string) {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      emitSelect(id);
    }
  }
  // Svelte 5 runes: props are already tracked; no reactive statements needed
</script>

<div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
  {#each items as c (c.id)}
    <Button.Root
      class="rounded-full px-3 py-1.5 text-sm border border-neutral-800 hover:bg-neutral-800 transition-colors whitespace-nowrap {selectedId ===
      c.id
        ? 'bg-neutral-800'
        : ''}"
      onclick={(ev: MouseEvent) => onClick(ev, c.id)}
      onkeydown={(ev: KeyboardEvent) => onKeyDown(ev, c.id)}
      aria-pressed={selectedId === c.id}
    >
      {c.name}
    </Button.Root>
  {/each}
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
