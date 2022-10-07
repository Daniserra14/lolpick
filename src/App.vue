<script>
export default {
  data() {
    return {
      navLinks: [
        {
          url: "/",
          name: "Home",
        },
        {
          url: "/play",
          name: "Play",
        },
        {
          url: "/rate",
          name: "Rate",
        },
      ],
    };
  },
};
</script>
<template>
  <div class="container mx-auto min-h-screen dark:text-white">
    <div
      id="nav"
      class="container mx-auto flex justify-end gap-2 py-4 dark:text-white"
    >
      <router-link
        v-for="navLink in navLinks"
        :key="navLink"
        class="box-content w-12 rounded-lg border border-transparent p-2 text-center shadow-sm transition-all duration-300 dark:hover:shadow-indigo-300"
        :to="navLink.url"
        >{{ navLink.name }}</router-link
      >
    </div>
    <router-view />
  </div>
</template>
