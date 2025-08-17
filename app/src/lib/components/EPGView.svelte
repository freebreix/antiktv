<script lang="ts">
  type Channel = { id: string; name: string };
  type Program = { id: string; channelId: string; title: string; start: number; end: number };
  let { programs, channels, selectedChannelId } = $props<{ programs: Program[]; channels: Channel[]; selectedChannelId: string }>();
  const fmt = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const visible = $derived(programs.filter(p => p.channelId === selectedChannelId));
</script>

<div class="space-y-2">
  <h2 class="text-sm font-semibold opacity-80">Now & Next</h2>
  <ul class="space-y-1">
    {#each visible as p (p.id)}
      <li class="rounded-lg border border-neutral-800 p-2">
        <div class="text-xs opacity-70">{fmt(p.start)} – {fmt(p.end)}</div>
        <div class="text-sm font-medium">{p.title}</div>
      </li>
    {/each}
    {#if visible.length === 0}
      <li class="text-sm opacity-60">No EPG for this channel.</li>
    {/if}
  </ul>
</div>
