<script lang="ts">
	import { format } from 'date-fns';
	import { Interval } from 'svelte-interval-rune';

	const time = new Interval(1000);
</script>

<div style:margin="0 0.75rem">
	{format(time.current, 'EEE MMM dd')}&nbsp; {format(time.current, 'h:mm aa')}
</div>
