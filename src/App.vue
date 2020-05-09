<template>
  <v-app v-if="storeLoaded">
    <v-app-bar app clipped-left flat color="primary">
      <div class="d-flex align-center">
        <app-bar-header/>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click.prevent="login" v-if="!this.$auth.isAuthenticated()" depressed color="#6441A5" style="color: white">
        <v-icon left>mdi-twitch</v-icon>Login
      </v-btn>
      <ProfileBadge v-if="this.$auth.isAuthenticated()"/>
    </v-app-bar>

    <v-navigation-drawer v-if="this.$auth.isAuthenticated()" clipped app>
      <v-list>
        <v-list-item v-for='item in sidebarItems' :key='item.title' link :href='item.route' :class="item.route === $route.path ? 'active-nav-item' : ''">
          <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content style='max-height: 100vh'>
      <router-view style='height: 100%; overflow-y: auto'></router-view>
    </v-content>

    <v-footer app fixed padless width="100%" style="bottom: 0">
      <v-card flat tile width="100%" class='text-center' style="background-color: #ffd42a">
        <v-card-text class="pb-0">
          <v-btn class="mx-4" icon small to="/">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn v-for="icon in footerIcons" :key="icon.icon" class="mx-4" icon small :href="icon.link" target="_blank" rel="noopener noreferrer">
            <v-icon>{{icon.icon}}</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text>
          <v-icon small>mdi-copyright</v-icon>
          {{ new Date().getFullYear() }} - 
          <a href="https://github.com/mitchwadair" target="_blank" rel="noopener noreferrer">Mitchell Adair</a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import AppBarHeader from './components/AppBarHeader';
import ProfileBadge from './components/ProfileBadge';

export default {
  name: 'App',

  components: {
    AppBarHeader,
    ProfileBadge,
  },

  data: function() {
    return {
      storeLoaded: false,
      sidebarItems: [
        {title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard'},
        {title: 'About', icon: 'mdi-help-box', route: '/about'}
      ],
      footerIcons: [
        {icon: 'mdi-github', link: 'https://github.com/mitchwadair/mthebot'},
        {icon: 'mdi-linkedin', link: 'https://www.linkedin.com/in/mitchell-adair/'},
        {icon: 'mdi-twitch', link: 'https://twitch.tv/mtheb_'},
        {icon: 'mdi-patreon', link: 'https://www.patreon.com/mthebot_'},
        {icon: 'mdi-email', link: 'mailto:mthebot6969@gmail.com'},
      ],
    }
  },
  methods: {
    login: function() {
      this.$auth.login();
    }
  },
  created() {
    if (this.$auth.isAuthenticated()) {
      this.$auth.getProfileData().then(res => {
        this.$store.commit('setUserData', res.data.data[0]);
        this.storeLoaded = true;
      });
    } else {
      this.storeLoaded = true;
    }
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      this.$router.push(redirect);
    }
  }
};
</script>

<style scoped>
.active-nav-item {
  background-color: rgba(0, 0, 0, .15);
}
</style>