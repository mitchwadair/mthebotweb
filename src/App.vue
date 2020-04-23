<template>
  <v-app>
    <v-app-bar app clipped-left dense flat color="primary">
      <div class="d-flex align-center">
        <app-bar-header/>
      </div>
    </v-app-bar>

    <v-navigation-drawer clipped app>
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

  data: () => {
    return {
      sidebarItems: [
        {title: 'Dashboard', route: '/dashboard'},
        {title: 'About', route: '/about'}
      ]
    }
  },
};
</script>