<template>
    <v-menu offset-y left close-on-click>
        <template v-slot:activator="{on}">
            <v-btn text v-on="on" :ripple=false>
                <v-avatar class='mr-2' size="36" left>
                    <img
                        :src="avatar"
                        alt="avatar"
                    />
                </v-avatar>
                {{displayName}}
            </v-btn>
        </template>

        <v-list dense>
            <v-list-item v-for='item in items' :key='item.title' :to='item.route'>
                <v-list-item-icon>
                    <v-icon left dense>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout">
                <v-list-item-icon>
                    <v-icon left dense>mdi-logout-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import navItems from '../defaults/navitems.json';

export default {
    name: 'app-bar-profile-badge',
    data: function() {
        return {
            items: navItems,
        }
    },
    computed: {
        avatar() {
            return this.$store.state.userData ? this.$store.state.userData.profile_image_url : null;
        },
        displayName() {
            return this.$store.state.userData ? this.$store.state.userData.display_name : '';
        }
    },
    methods: {
        logout: function() {
            this.$auth.logout();
        },
    }
}
</script>