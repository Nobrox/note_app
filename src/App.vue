<template>
  <!-- Main container of the application -->
  <div id="app" class="min-h-screen bg-gray-900 flex flex-col items-center text-white relative">

    <!-- Application header -->
    <header class="w-full text-center pt-8 pb-8">
    <!-- Application title -->
      <h1 class="text-4xl font-bold">Note Application</h1>
    </header>

    <!-- Dashboard component -->
    <Dashboard />
  </div>
</template>

<script setup lang="ts">
  // Importing the Dashboard component
  import Dashboard from './components/Dashboard.vue';
</script>

<style>
</style>