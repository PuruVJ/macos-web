<script lang='ts'>
        import { theme } from '🍎/stores/theme.store';
	import {addNote, notesStore} from './store';

	const NEW_NOTE = {title: '', text: ''};
	
	let editing = false;
	let note;
	let selectedId;
	let textInput;
	let titleInput;
	
	$: sortedNotes = Object.values($notesStore).sort();
	$: note = $notesStore[selectedId] || NEW_NOTE;
	
	function deleteNote() {
	  notesStore.update(notes => {
            delete notes[note.id];
            return notes;
          });
	}
	
	function editNote() {
          textInput.focus();
	  editing = true;
	}
	
	function handleSubmit() {
          // do nothing for now
	}
	
	function newNote() {
	  selectedId = addNote('', '');
          editing = true;
	  titleInput.focus();
	}

</script>

<section class="container">
    <header class="titlebar app-window-drag-handle">
        <span>
          <label for="title"/>
          <input id="title" readonly={!editing} bind:this={titleInput} bind:value={note.title}  />
        </span>
      <div>
          <button disabled={!note.id} on:click={deleteNote}><img src="/Notes-icons/delete.webp" alt="delete"></button>
	  <button disabled={!note.id} on:click={editNote}><img src="/Notes-icons/edit.webp" alt="edit"></button>
          <button on:click={newNote}><img src="/Notes-icons/New.webp" alt="new"></button>

      </div>
    </header>

    <aside class:light={$theme.scheme === 'light'}>
        <div>
          <select bind:value={selectedId}>
            <option>Select note</option>
          {#each sortedNotes as note}
            <option value={note.id}>{note.title}</option>
          {/each}
          </select>
        </div>
    </aside>

    <section class="content">
        <form on:submit|preventDefault={handleSubmit}>
            <textarea readonly={!editing} rows="10" bind:this={textInput} bind:value={note.text} />
        </form>
    </section>
</section>


<style lang="scss">
    .container {
      --color: var(--system-color-light-hsl);
  
      display: grid;
      grid-template-columns: 12rem 1fr;
      grid-template-rows: 3rem 1fr;
  
      border-radius: inherit;
  
      background-image: linear-gradient(
        to right,
        hsla(var(--color), 0.7) 12rem,
        hsla(var(--color), 1) 12rem 100%
      );
  
      transition: --color 200ms ease-in;
  
      color: var(--system-color-dark);
    }
  
    .titlebar {
      grid-area: 1 / 1 / span 1 / span 2;
  
      display: flex;
      justify-content: right;
  
      z-index: 1;
  
      padding: 0.9rem 1rem;
  
      width: 100%;
  
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
  
      user-select: none;

    }

    .content {
      border-top: solid 0.9px hsla(var(--system-color-dark-hsl), 0.3);
      grid-area: 2 / 2 / span 1 / span 1;

      display: flex;
      flex-direction: column;
      align-items: left;

      padding: 1rem;
    }

    select{
      border: none;
      background: none;
      color: hsla(var(--system-color-dark-hsl), 0.8);
    }

    textarea{
      border: none;
      background: none;
      color: hsla(var(--system-color-dark-hsl), 0.8);
      resize: none;
      height: 295%;
      width: 95%;
    }

    input{
      border: none;
      background: none;
      color: hsla(var(--system-color-dark-hsl), 0.8);
      font-size: large;
    }
</style>
