import {writable} from 'svelte/store';

let lastId = 0;

type Note = {
	id: number;
	title: string;
	text: string;
}

// Keys are ids and values are objects with id, title, and text properties.
export const notesStore = writable<Record<number, Note>>({});

export function addNote(title: string, text: string) {
	lastId++;
  const note = {id: lastId, title, text};
	notesStore.update(notes => {
		notes[lastId] = note;
		return notes;
	});
	return lastId;
}

addNote('About macOS web', 'macOS web is a web replica of macOS created in svelte.');
