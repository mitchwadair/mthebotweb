<template>
  <v-app v-if="storeLoaded">
    <v-app-bar app clipped-left flat color="primary" light>
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
        <v-list-item v-for='item in sidebarItems' :key='item.title' link :to='item.route'>
          <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style='max-height: 100vh'>
      <router-view style='height: 100%; overflow-y: auto'></router-view>
    </v-main>

    <v-footer app fixed padless width="100%" style="bottom: 0" light>
      <v-card flat tile width="100%" class='text-center' color="primary">
        <v-card-text class="pt-2 pb-0">
          <v-btn class="mx-2" icon small to="/">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn v-for="icon in footerIcons" :key="icon.icon" class="mx-2" icon small :href="icon.link" target="_blank" rel="noopener noreferrer">
            <v-icon>{{icon.icon}}</v-icon>
          </v-btn>
          <v-btn class="mx-2" icon small @click="openContactDialog">
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text class='py-2'>
          <v-icon small>mdi-copyright</v-icon>
          {{ new Date().getFullYear() }} - 
          <a href="https://github.com/mitchwadair" target="_blank" rel="noopener noreferrer" style="color: rgba(0, 0, 0, 0.54)">Mitchell Adair</a>
        </v-card-text>
      </v-card>
    </v-footer>

    <ContactDialog/>
  </v-app>
</template>

<script>
import AppBarHeader from './components/AppBarHeader';
import ProfileBadge from './components/ProfileBadge';
import ContactDialog from './components/ContactDialog';
import navItems from './defaults/navitems.json';

export default {
  name: 'App',

  components: {
    AppBarHeader,
    ProfileBadge,
    ContactDialog,
  },

  data: function() {
    return {
      storeLoaded: false,
      sidebarItems: navItems,
      footerIcons: [
        {icon: 'mdi-github', link: 'https://github.com/mitchwadair/mthebot'},
        {icon: 'mdi-linkedin', link: 'https://www.linkedin.com/in/mitchell-adair/'},
        {icon: 'mdi-twitch', link: 'https://twitch.tv/mtheb_'},
      ],
    }
  },
  methods: {
    login: function() {
      this.$auth.login();
    },
    openContactDialog: function() {
      this.$store.commit('setContactDialog', true);
    }
  },
  created() {
    if (!localStorage.getItem('version') || localStorage.getItem('version') !== 'scopeUpgrade2') {
      this.$auth.logout();
      localStorage.setItem('version', 'scopeUpgrade2');
    }
    if (this.$auth.isAuthenticated()) {
      this.$store.commit('setUserData', this.$auth.getProfileData());
    }
    this.storeLoaded = true;
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      this.$router.replace(redirect);
    }
  }
};
</script>