<template>
  <div id="dashboard">
    <v-container v-if="loadingData" style="height: 100%">
        <v-row style="height: 100%" align="center">
            <v-col align="center">
                <v-progress-circular indeterminate color="primary" size="100" width="8"/>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
      <v-row>
        <v-col align="center">
          <h1 class='display-3'>Welcome {{userData.display_name}}</h1>
        </v-col>
      </v-row>
      <v-row class='mx-4'>
        <v-col>
          <v-card v-if="botStatus" flat>
            <v-card-title>MtheBot_ is Enabled</v-card-title>
            <v-card-text>
              MtheBot_ is currently sitting in your chat awaiting commands! Please ensure MtheBot_ has moderator status in your chat
              to ensure everything works. You may disable MtheBot_ and it will leave your chat.
            </v-card-text>
            <v-card-actions>
                <v-btn @click="disableBot" text color="primary">Disable MtheBot_</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else flat>
            <v-card-title>MtheBot_ is Disabled</v-card-title>
            <v-card-text>MtheBot_ must be enabled in order to enhance your chat experience.  Enable MtheBot_ so it can join your chat and make sure to give it moderator status to avoid any issues.</v-card-text>
            <v-card-actions>
                <v-btn @click="enableBot" text color="primary">Enable MtheBot_</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="botStatus" class='mt-5 mx-4 justify-around'>
        <v-col v-for="(cardData, i) in navCardData" :key="i">
          <v-card height="100%" class='d-flex flex-column'>
            <v-card-title>{{cardData.title}}</v-card-title>
            <v-card-text>{{cardData.content}}</v-card-text>
            <v-card-actions class='mt-auto'>
                <v-btn text color="primary" :to="cardData.route">{{cardData.action}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row class='mt-5 mx-4'>
        <v-col>
          <v-card height="100%" class='d-flex flex-column'>
            <v-card-title>About</v-card-title>
            <v-card-text>Learn more about MtheBot_</v-card-text>
            <v-card-actions class='mt-auto'>
                <v-btn text color="primary" to="/about">About</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card height="100%" class='d-flex flex-column'>
            <v-card-title>Support</v-card-title>
            <v-card-text>Consider supporting the development and maintenance of MtheBot_ by supporting me on Patreon!</v-card-text>
            <v-card-actions class='mt-auto'>
                <v-btn text color="primary" href='https://www.patreon.com/mitchdev' target="_blank" rel="noopener noreferrer">MtheBot_ on Patreon</v-btn>
            </v-card-actions>
          </v-card>
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
      navCardData: [
        {title: 'Commands', content: 'Modify MtheBot_\'s commands for your channel', route:'/commands', action: 'Go to Commands'},
        {title: 'Events', content: 'Modify MtheBot_\'s channel event messages', route:'/events', action: 'Go to Events'},
        {title: 'Timed Messages', content: 'Modify MtheBot_\'s timed channel messages', route:'/timers', action: 'Go to Timers'},
      ],
      loadingData: true,
    };
  },
  computed: {
    userData() {
      return this.$store.state.userData;
    },
  },
  mounted() {
    const channel = this.$store.state.userData.login;
    this.axios.get(`/chats/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
      this.loadingData = false;
      if (res.status === 404) {
        this.botStatus = false;
        return;
      }
      this.botStatus = !!res.data;
    });
  },
  methods: {
    disableBot: function() {
      const channel = this.$store.state.userData.login;
      this.axios.delete(`/chats/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
        if (res.status === 200) {
          this.botStatus = false;
        }
      });
    },
    enableBot: function() {
      const channel = this.$store.state.userData.login;
      this.axios.get(`/chats/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
        if (res.status === 404) {
          this.axios.post(`/init/${channel}`, {}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
            if (res.status === 200) {
              this.botStatus = true;
            }
          }).catch(err => {
              console.log(`ERROR: ${err}`);
          });
        } else {
          this.axios.post(`/chats/${channel}`, {}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
            if (res.status === 200) {
              this.botStatus = true;
            }
          }).catch(err => {
              console.log(`ERROR: ${err}`);
          });
        }
      });
    }
  }
}
</script>