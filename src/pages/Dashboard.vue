<template>
  <div id="dashboard">
    <v-container>
      <v-row>
        <v-col align="center">
          <h1 class='display-3'>Welcome {{userData.display_name}}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          {{botStatus}}
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data: function() {
    return {
      botStatus: null,
    };
  },
  computed: {
    userData() {
      return this.$store.state.userData;
    },
  },
  mounted() {
    this.axios.get('https://api.bot.mtheb.tv/users').then(res => {
      this.botStatus = res;
    });
  }
}
</script>