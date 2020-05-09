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
          <div v-if="botStatus">
            MtheBot_ is currently enabled in your chat!
            <v-btn @click="disableBot" depressed color="primary">Disable MtheBot_</v-btn>
          </div>
          <div v-else>

          </div>
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
    const channel = this.$store.state.userData.login;
    this.axios.get(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
      this.botStatus = !!res.data;
    });
  },
  methods: {
    disableBot: function() {
      const channel = this.$store.state.userData.login;
      this.axios.delete(`https://api.bot.mtheb.tv/chats/${channel}`).then(() => {
        this.botStatus = false;
      })
    }
  }
}
</script>