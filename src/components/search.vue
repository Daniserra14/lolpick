<script>
export default {
    data() {
        return {
            search: ''
        }
    },
    methods: {
        updateSearch() {
            this.$emit('search', this.search)
        },
        clearSearch() {
            this.search = ''
            this.$emit('search', this.search)
        }
    }
}
</script>
<template>
    <form class="my-3 flex items-center">
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <svg
          aria-hidden="true"
          class="h-5 w-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        id="simple-search"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
        placeholder="Champion name"
        v-model="this.search"
        @input="updateSearch"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        @click="clearSearch"
      >
        <svg
          class="h-6 w-6 text-gray-500 hover:text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  </form>
</template>