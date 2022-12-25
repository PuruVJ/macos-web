<script>
    export let text;
      
    $: words = text.split(' ').length;
</script>
  
<div>
    {words} words, {text.length} characters
</div>
