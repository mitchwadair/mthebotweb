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
          <h1 class='display-3'>Welcome, {{userData.display_name}}!</h1>
        </v-col>
      </v-row>
      <v-row class='mx-auto' style='max-width: 90%'>
        <v-col>
          <v-card v-if="botStatus" color='rgba(0, 0, 0, 0)' flat>
            <v-card-title>MtheBot_ is Enabled</v-card-title>
            <v-card-text>
              MtheBot_ is currently sitting in your chat awaiting commands! Please ensure MtheBot_ has moderator status in your chat
              so everything works correctly. You may disable MtheBot_ and it will leave your chat.
            </v-card-text>
            <v-card-actions>
                <v-btn @click="disableBot" text color="primary">Disable MtheBot_</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else color='rgba(0, 0, 0, 0)' flat>
            <v-card-title>MtheBot_ is Disabled</v-card-title>
            <v-card-text>MtheBot_ must be enabled in order to enhance your chat experience.  Enable MtheBot_ so it can join your chat and make sure to give it moderator status to avoid any issues.</v-card-text>
            <v-card-actions>
                <v-btn @click="enableBot" text color="primary">Enable MtheBot_</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-divider class='mx-auto' style='max-width: 80%'/>
      <v-row v-if="botStatus" class='mx-auto' style='max-width: 90%'>
        <v-col v-for="(cardData, i) in navCardData" :key="i">
          <v-card flat color='rgba(0, 0, 0, 0)' height="100%" class='d-flex flex-column'>
            <v-card-title>{{cardData.title}}</v-card-title>
            <v-card-text>{{cardData.content}}</v-card-text>
            <v-card-actions class='mt-auto'>
                <v-btn text color="primary" :to="cardData.route">{{cardData.action}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-divider class='mx-auto' style='max-width: 80%'/>
      <v-row class='mx-auto' style='max-width: 90%'>
        <v-col>
          <v-card flat color='rgba(0, 0, 0, 0)' height="100%" class='d-flex flex-column'>
            <v-card-title>About</v-card-title>
            <v-card-text>Learn more about MtheBot_</v-card-text>
            <v-card-actions class='mt-auto'>
                <v-btn text color="primary" to="/about">About</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat color='rgba(0, 0, 0, 0)' height="100%" class='d-flex flex-column'>
            <v-card-title>Support</v-card-title>
            <v-card-text>Consider supporting the development and maintenance of MtheBot_ by supporting me on GitHub Sponsors or donating through PayPal!</v-card-text>
            <v-card-actions class='mt-auto'>
                <v-btn text color="primary" href='https://github.com/sponsors/mitchwadair' target="_blank" rel="noopener noreferrer">GitHub Sponsors</v-btn>
                <v-btn text color="primary" href='https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=9WS3KJPAV8JDJ&currency_code=USD' target="_blank" rel="noopener noreferrer">
                  Donate
                </v-btn>
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
    const channel = this.$store.state.userData.id;
    this.axios.get(`/chats/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
      this.loadingData = false;
      this.botStatus = !!res.data;
    }).catch(err => {
      this.loadingData = false;
      if (err.response.status === 404) {
        this.botStatus = false;
        return;
      } else if (err.response.status === 401) {
        localStorage.removeItem('uat');
        localStorage.removeItem('userData');
        this.$router.push(`/?error=auth&message=${err.response.data}`);
        this.$router.go();
        return;
      }
      console.log(`ERROR: ${err}`);
    });
  },
  methods: {
    disableBot: function() {
      const channel = this.$store.state.userData.id;
      this.axios.delete(`/chats/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
        if (res.status === 200) {
          this.botStatus = false;
        }
      });
    },
    enableBot: function() {
      const channel = this.$store.state.userData.id;
      this.axios.post(`/chats/${channel}`, {}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
        if (res.status === 200) {
          this.botStatus = true;
        }
      }).catch(err => {
        console.log(`ERROR: ${err}`);
      });
    }
  }
}
</script>