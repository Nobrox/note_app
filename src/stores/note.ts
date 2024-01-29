// Importing Pinia defineStore function and the Note interface
import { defineStore } from 'pinia';
import type { Note } from '../models/note';

// Define a Pinia store with the name 'notes'
export const useNotesStore = defineStore('notes', {

  // State of the store
  state: () => {

    // Attempting to load notes from localStorage
    const savedNotes = localStorage.getItem('notes');
    return {

      // If notes exist in localStorage, parse them; otherwise, initialize with an empty array
      notes: savedNotes ? JSON.parse(savedNotes) : [] as Note[],

      // State for tracking the ID of a dragged note, initially null
      draggedNoteId: null as string | null,
    };
  },

  // Actions for manipulating the state
  actions: {

    // Action to add a new note
    addNote(note: Note) {
      this.notes.push(note);  // Add the new note to the notes array
      this.saveNotes();       // Save updated notes to localStorage
    },

    // Action to remove a note by its ID
    removeNote(id: string) {
      const index = this.notes.findIndex((note: Note) => note.id === id); // Find the note index
      if (index !== -1) {
        this.notes.splice(index, 1);  // Remove the note if found
        this.saveNotes();             // Save the updated notes to localStorage
      }
    },

    // Action to update the order of notes
    updateOrder(updatedNotes: Note[]) {
      this.notes = updatedNotes;      // Update the notes array with the reordered notes
      this.saveNotes();               // Save the reordered notes to localStorage
    },

    // Action to save notes to localStorage
    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes)); // Serialize and save the notes array to localStorage
    },
  },
});