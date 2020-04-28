<template>
  <v-app>
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
        <v-list-item v-for='item in sidebarItems' :key='item.title' link :href='item.route'>
          <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
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
      sidebarItems: [
        {title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard'},
        {title: 'About', icon: 'mdi-help', route: '/about'}
      ],
    }
  },
  methods: {
    login: function() {
      let loginURL = new URL('https://id.twitch.tv/oauth2/authorize');
      const params = {
          client_id: 'cd1q55j22rdxm0o3lp2jwy8osgsjn2',
          redirect_uri: process.env.NODE_ENV == 'development' ? 'http://localhost:8080/auth' : 'https://bot.mtheb.tv/auth',
          response_type: 'token',
          force_verify: true,
      }
      Object.keys(params).forEach(key => {
        loginURL.searchParams.append(key, params[key]);
      });
      window.location.assign(loginURL);
    }
  },
  created() {
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      this.$router.push({path: redirect.pathname, hash: redirect.hash});
    }
  }
};
</script>