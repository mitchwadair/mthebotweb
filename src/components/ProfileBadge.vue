<template>
    <v-menu location="bottom">
        <template #activator="{ props }">
            <v-btn variant="text" v-bind="props" :ripple="false">
                <v-avatar class='mr-2' size="36">
                    <img :src="avatar" alt="avatar" />
                </v-avatar>
                {{displayName}}
            </v-btn>
        </template>

        <v-list density="compact">
            <v-list-item
                v-for='item in items'
                :key='item.title'
                :to='item.route'
                :title='item.title'
                :prepend-icon='item.icon'
            />
            <v-divider></v-divider>
            <v-list-item @click="logout" title="Logout" prepend-icon="mdi-logout-variant" />
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
