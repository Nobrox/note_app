<template>
  <!-- Main container for the note app -->
  <div class="flex flex-col items-center justify-center w-full px-4">

    <!-- Button to toggle global note size -->
    <button @click="toggleGlobalNoteSize"
    :class="[
    'font-bold py-2 px-12 rounded mb-14 transition-all duration-300',
    isGlobalExpanded ? 'bg-orange-500 hover:bg-orange-700 text-white' : 'bg-green-500 hover:bg-green-700 text-white'
    ]">
      {{ isGlobalExpanded ? 'Shrink Notes' : 'Expand Notes' }}
    </button>

    <!-- Textarea for entering a new note -->
    <textarea v-model="newNote"
    @focus="expandTextArea"
    @blur="shrinkTextArea"
    :class="textareaClass"
    placeholder="Add a new note"
    class="p-5 w-full max-w-xs border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
    rows="4">
    </textarea>

    <!-- Button to add a new note -->
    <button @click="addNote" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-12 rounded mb-14">
      Add Note
    </button>
  </div>

  <!-- Container for displaying notes -->
  <div class="flex flex-wrap justify-center gap-4" @drop.prevent="handleDragEnd" @dragover.prevent>

    <!-- Loop through each note and display it -->
    <div v-for="(note, index) in notes"
    :key="note.id"
    :class="['note bg-white text-gray-800 shadow-lg rounded p-4 w-auto ', 
    isGlobalExpanded ? 'sm:min-w-[500px] md:min-w-[600px] lg:min-w-[700px] xl:min-w-[1000px]' : 'min-w-[300px]',
    'min-h-[50px] max-w-xs break-words transition-all duration-700',
    note.id === removingNoteId ? 'opacity-0 scale-90 bg-red-800' : 'opacity-100 scale-100',
    note.id === draggedNoteId ? 'shadow-2xl scale-110 border-2 border-sky-500 border-dashed' : '']"
    draggable="true"
    @dragstart="handleDragStart(note, index)"
    @dragenter.prevent="note.id !== draggedNoteId ? handleDragEnter(index) : null"
    >
      <!-- Display note content -->
      <pre class="text-gray-800 mb-4 whitespace-pre-wrap">{{ note.content }}</pre>

      <!-- Button to remove a note -->
      <button @click="removeNoteAnimated(note.id)" class="remove-btn bg-inherit py-2 px-4 rounded absolute bottom-0 right-0">
        <img src="../components/icons/red-delete-icon.svg" class='w-9 flex content-center' alt="delete button">
      </button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  // Importing necessary functions and types from Vue and local files
  import { ref, computed } from 'vue';
  import { useNotesStore } from '../stores/note';
  import type { Note } from '../models/note';

  // Use a Pinia store for managing notes state
  const notesStore = useNotesStore();

  // Reactive references for component state
  const notes = ref(notesStore.notes);              // Array of notes from the store
  const newNote = ref('');                          // Current value of a new note input
  const removingNoteId = ref<string | null>(null);  // ID of the note being removed
  const draggedNoteId = ref<string | null>(null);   // ID of the note being dragged
  const draggedIndex = ref<number>(-1);             // Index of the note being dragged
  const isExpanded = ref(false);                    // State for text area expansion
  const isGlobalExpanded = ref(false);              // State for global note expansion

  // Computed property to determine textarea class based on expansion state
  const textareaClass = computed(() => isExpanded.value ? 'h-40' : 'h-20');

  // Action to add a new note
    const addNote = () => {

    // Check if the new note's value is not empty
    if (newNote.value.trim() !== '') {

      // Add the new note to the store
      notesStore.addNote({
        id: Date.now().toString(),    // Generate a unique ID
        content: newNote.value,       // Set the note content
      });
      newNote.value = '';             // Reset the new note input
      isExpanded.value = false;       // Collapse the text area
    }
  };

  // Action to expand the textarea when focused
  const expandTextArea = () => {
    isExpanded.value = true;
  };

  // Action to collapse the textarea when unfocused and empty
  const shrinkTextArea = () => {
    if (newNote.value.trim() === '') {
      isExpanded.value = false;
    }
  };

  // Action to remove a note with an animation
  const removeNoteAnimated = (id: string) => {
    removingNoteId.value = id;
    setTimeout(() => {
      notesStore.removeNote(id);        // Remove the note from the store
      removingNoteId.value = null;      // Reset the removing note ID
    }, 700);                            // Delay to allow for animation
  };

  // Action to handle the start of dragging a note
  const handleDragStart = (note: Note, index: number) => {
    draggedNoteId.value = note.id;      // Set the dragged note ID
    draggedIndex.value = index;         // Set the index of the dragged note
  };

  // Action to handle dragging a note over another note
  const handleDragEnter = (targetIndex: number) => {
    if (draggedIndex.value !== -1 && draggedIndex.value !== targetIndex) {

      // Perform the note swapping logic
      const draggedNote = notes.value.splice(draggedIndex.value, 1)[0];
      notes.value.splice(targetIndex, 0, draggedNote);
      draggedIndex.value = targetIndex; // Update the dragged notes index
    }
  };

  // Action to finalize note dragging
  const handleDragEnd = () => {
    if (draggedIndex.value !== -1) {
      notesStore.updateOrder(notes.value); // Update the order of notes in the store
    }

    // Reset the drag state
    draggedNoteId.value = null;
    draggedIndex.value = -1;
  };

  // Action to toggle the global expansion of notes
  const toggleGlobalNoteSize = () => {
    isGlobalExpanded.value = !isGlobalExpanded.value;
  };
</script>