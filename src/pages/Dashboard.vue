<template>
  <div id="dashboard">
    <v-container>
      <v-row>
        <v-col align="center">
          <h1 class='display-3'>Welcome {{userData.display_name}}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card v-if="botStatus" flat style="margin: 0 6rem">
            <v-card-title>MtheBot_ is Enabled</v-card-title>
            <v-card-text>MtheBot_ is currently sitting in your chat awaiting commands! You may disable MtheBot_ and it will leave your chat.</v-card-text>
            <v-card-actions>
                <v-btn @click="disableBot" text color="primary">Disable MtheBot_</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else flat style="margin: 0 6rem">
            <v-card-title>MtheBot_ is Disabled</v-card-title>
            <v-card-text>MtheBot_ must be enabled in order to enhance your chat experience.  Enable MtheBot_ so it can join your chat and make sure to give it moderator status to avoid any issues.</v-card-text>
            <v-card-actions>
                <v-btn @click="enableBot" text color="primary">Enable MtheBot_</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="botStatus" class='mt-5'>
        <v-spacer></v-spacer>
        <v-col v-for="(cardData, i) in navCardData" :key="i">
          <v-card height="100%" class='d-flex flex-column'>
            <v-card-title>{{cardData.title}}</v-card-title>
            <v-card-text>{{cardData.content}}</v-card-text>
            <v-card-actions class='mt-auto'>
                <v-btn text color="primary" :to="cardData.route">{{cardData.action}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row class='mt-5'>
        <v-spacer></v-spacer>
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
                <v-btn text color="primary" href='https://www.patreon.com/mthebot_' target="_blank" rel="noopener noreferrer">MtheBot_ on Patreon</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import defaultEvents from '../defaults/events.json';

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
      });
    },
    enableBot: function() {
      const channel = this.$store.state.userData.login;
      this.axios.get(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
        let promises = []
        if (res.status === 404) {
          promises.push(this.axios.post(`https://api.bot.mtheb.tv/commands/${channel}`, {}));
          promises.push(this.axios.post(`https://api.bot.mtheb.tv/timers/${channel}`, {}));
          promises.push(this.axios.post(`https://api.bot.mtheb.tv/commands/${channel}`, defaultEvents));
        }
        Promise.all(promises).then(() => {
          this.axios.post(`https://api.bot.mtheb.tv/chats/${channel}`).then(() => {
            this.botStatus = true;
          });
        });
      });
    }
  }
}
</script>