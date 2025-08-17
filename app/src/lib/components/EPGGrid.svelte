<script lang="ts">
  type Channel = { id: string; name: string };
  type Program = {
    id: string;
    channelId: string;
    title: string;
    start: number;
    end: number;
  };
  let {
    channels,
    programs,
    windowStart,
    windowEnd,
    slotMinutes = 30,
  } = $props<{
    channels: Channel[];
    programs: Program[];
    windowStart: number;
    windowEnd: number;
    slotMinutes?: number;
  }>();

  const slotMs = slotMinutes * 60 * 1000;
  const slots = $derived(
    Array.from(
      { length: Math.ceil((windowEnd - windowStart) / slotMs) + 1 },
      (_, i) => windowStart + i * slotMs
    )
  );
  const fmt = (t: number) =>
    new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  function programToGrid(p: Program) {
    const startIndex = Math.max(
      0,
      Math.floor((p.start - windowStart) / slotMs) + 1
    ); // +1 to account for channel name column
    const endIndex = Math.min(
      slots.length - 1,
      Math.ceil((p.end - windowStart) / slotMs) + 1
    );
    const span = Math.max(1, endIndex - startIndex);
    return { startCol: startIndex + 1, span };
  }
</script>

<div class="border border-neutral-800 rounded-lg overflow-hidden">
  <div
    class="grid text-xs bg-neutral-900"
    style={`grid-template-columns: 180px repeat(${slots.length - 1}, 1fr);`}
  >
    <div class="p-2 border-b border-neutral-800 sticky left-0 bg-neutral-900">
      Channel
    </div>
    {#each slots.slice(0, -1) as t}
      <div class="p-2 border-b border-neutral-800 text-center">{fmt(t)}</div>
    {/each}
  </div>
  <div class="divide-y divide-neutral-800">
    {#each channels as ch (ch.id)}
      <div
        class="grid items-stretch"
        style={`grid-template-columns: 180px repeat(${slots.length - 1}, 1fr);`}
      >
        <div
          class="p-2 bg-neutral-950 sticky left-0 z-10 border-r border-neutral-800"
        >
          {ch.name}
        </div>
        <!-- empty cells background -->
        {#each slots.slice(0, -1) as _, i}
          <div class="border-r border-neutral-900 bg-neutral-950/50"></div>
        {/each}
        <!-- overlay programs -->
        {#each programs.filter((p: Program) => p.channelId === ch.id) as p (p.id)}
          {@const grid = programToGrid(p)}
          <div
            class="col-start-[var(--start)] col-span-[var(--span)] p-1"
            style={`--start:${grid.startCol};--span:${grid.span}`}
          >
            <div
              class="h-full w-full rounded-md bg-neutral-800/60 border border-neutral-700 px-2 py-1 truncate"
            >
              <div class="text-[10px] opacity-70">
                {fmt(p.start)} – {fmt(p.end)}
              </div>
              <div class="text-sm font-medium truncate">{p.title}</div>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
