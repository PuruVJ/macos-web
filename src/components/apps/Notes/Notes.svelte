<script lang='ts'>
        import { theme } from '🍎/stores/theme.store';
	import {addNote, notesStore} from './store';
	import SystemDialog from '../SystemUI/SystemDialog.svelte';

	
        let noteDeleteDialog: SystemDialog;

	
	const NEW_NOTE = {title: '', text: ''};
	
	let editing = false;
	let note;
	let selectedId;
	let textInput;
	let titleInput;
	
	let noteDeleteTrigger = false;
        let noteDelete = false;
	
	$: sortedNotes = Object.values($notesStore).sort();
	$: note = $notesStore[selectedId] || NEW_NOTE;
	
	function deleteNote() {
		noteDeleteTrigger = true;
		if (noteDelete == true) {
	            notesStore.update(notes => {
                      delete notes[note.id];
		      return notes;
		    });
		}
	}
	
	noteDeleteTrigger = false;
        noteDelete = false;

	
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
	
	
  function handleClick() {
    noteDelete = true;
  }

  function close() {
    noteDeleteDialog.close();
  }


</script>

{#if noteDeleteTrigger === true }
<SystemDialog bind:this={noteDeleteDialog}>
  <section class="note-delete">
    <img
      width="128"
      height="128"
      src="/app-icons/notes/256.webp"
      alt="AppStore app"
      draggable="false"
    />

    <h3>Delete Note</h3>
    <p>Are you sure you want to delete this note?</p>

    <div class="buttons">
      <button on:click={close}> Cancel </button>
      <button class="confirm" on:click={handleClick}> Delete </button>
    </div>
  </section>
</SystemDialog>
{/if}
  
<section class="container">
    <header class="titlebar app-window-drag-handle">
        <span>
          <label for="title"/>
          <input id="title" readonly={!editing} bind:this={titleInput} bind:value={note.title}  />
        </span>
      <div>
          <button disabled={!note.id} on:click={editNote}>Edit</button>
          <button disabled={!note.id} on:click={deleteNote}>Delete</button>
          <button on:click={newNote}>New</button>

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
        height: 350%;
        width: 95%;
    }

    input{
        border: none;
        background: none;
        color: hsla(var(--system-color-dark-hsl), 0.8);
        font-size: large;
    }
    
    .note-delete {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    padding: 1rem 0 0;

    width: 20rem;

    color: var(--system-color-dark);

    h3,
    p {
      text-align: center;
    }

    h3 {
      font-size: 1.2rem;
      font-weight: 500;
    }

    p {
      font-size: 0.9rem;
    }

    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;

      width: 100%;

      button {
        width: 100%;
        height: 2rem;

        font-weight: 500;

        border-radius: 0.5rem;

        background-color: hsla(var(--system-color-dark-hsl), 0.2);

        &:hover {
          background-color: hsla(var(--system-color-dark-hsl), 0.3);
        }

        &.confirm {
          background-color: var(--system-color-primary);

          color: var(--system-color-primary-contrast);

          &:hover {
            background-color: hsla(var(--system-color-primary-hsl), 0.8);
          }
        }
      }
    }
  }
</style>
