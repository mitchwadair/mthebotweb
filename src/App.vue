<template>
  <v-app>
    <v-app-bar app color="primary">
      <div class="d-flex align-center">
        <v-img
          alt="MtheBot_ Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/logo.png')"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>MtheBot_</v-toolbar-title>
      </div>
    </v-app-bar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>