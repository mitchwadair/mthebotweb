<template>
  <v-app>
    <v-app-bar app clipped-left flat color="primary">
      <div class="d-flex align-center">
        <app-bar-header/>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click.prevent="login" v-if="!this.$auth.isAuthenticated()" depressed color="#6441A5" style="color: white">
        <v-icon left>fab fa-twitch</v-icon>Login
      </v-btn>
      <v-btn @click.prevent="logout" v-if="this.$auth.isAuthenticated()" text>
        <v-avatar class='mr-2' size="36" left>
          <img
            :src="avatar"
            alt="avatar"
          />
        </v-avatar>
        Logout
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="this.$auth.isAuthenticated()" clipped app>
      <v-list>
        <v-list-item v-for='item in sidebarItems' :key='item.title' link :href='item.route'>
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

export default {
  name: 'App',

  components: {
    AppBarHeader
  },

  data: function() {
    return {
      sidebarItems: [
        {title: 'Dashboard', route: '/dashboard'},
        {title: 'About', route: '/about'}
      ],
      avatar: this.$auth.profileData ? this.$auth.profileData.profile_image_url : '',
    }
  },
  methods: {
    logout: async function() {
      this.$auth.logout();
      this.$router.push('/');
    },
    login: function() {
      let loginURL = new URL('https://id.twitch.tv/oauth2/authorize');
      const params = {
          client_id: 'cd1q55j22rdxm0o3lp2jwy8osgsjn2',
          redirect_uri: 'http://localhost:8080/auth',//'https://bot.mtheb.tv/auth'
          response_type: 'token',
          force_verify: true,
      }
      Object.keys(params).forEach(key => {
        loginURL.searchParams.append(key, params[key]);
      });
      window.location.assign(loginURL);
    }
  }
};
</script>