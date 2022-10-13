<script lang="ts">
  import { format } from 'date-fns';
  import { createIntervalStore } from '🍎/stores/interval.store';

  const time = createIntervalStore(1000);
</script>

<div style:margin="0 0.5rem">
  {format($time, 'EEE MMM dd')}&nbsp; {format($time, 'h:mm aa')}
</div>
