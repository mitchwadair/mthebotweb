<template>
    <v-app v-if="storeLoaded" class="d-flex flex-column min-h-screen">
        <v-app-bar flat color="primary" elevation="0" theme="light">
            <div class="d-flex align-center">
                <app-bar-header />
            </div>
            <v-spacer></v-spacer>
            <v-btn
                @click.prevent="login"
                v-if="!this.$auth.isAuthenticated()"
                variant="flat"
                color="#6441A5"
                style="color: white"
            >
                <v-icon icon="mdi-twitch" class="mr-2" />Login
            </v-btn>
            <ProfileBadge v-if="this.$auth.isAuthenticated()" />
        </v-app-bar>

        <v-navigation-drawer v-if="this.$auth.isAuthenticated()" permanent>
            <v-list nav>
                <v-list-item
                    v-for="item in sidebarItems"
                    :key="item.title"
                    :to="item.route"
                    :title="item.title"
                    :prepend-icon="item.icon"
                />
            </v-list>
        </v-navigation-drawer>

        <v-main class="flex-grow-1">
            <router-view></router-view>
        </v-main>

        <v-footer elevation="0" width="100%" style="bottom: 0" theme="light" class="pa-0 flex-grow-0 flex-shrink-0">
            <v-card flat rounded="0" width="100%" class="text-center pa-0 flex-grow-0" color="primary">
                <v-card-text class="py-1">
                    <v-btn class="mx-2" icon size="small" to="/">
                        <v-icon icon="mdi-home"></v-icon>
                    </v-btn>
                    <v-btn
                        v-for="icon in footerIcons"
                        :key="icon.icon"
                        class="mx-2"
                        icon
                        size="small"
                        :href="icon.link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <v-icon :icon="icon.icon"></v-icon>
                    </v-btn>
                </v-card-text>
                <v-card-text class="py-1">
                    <v-icon size="small" icon="mdi-copyright"></v-icon>
                    {{ new Date().getFullYear() }} -
                    <a
                        href="https://github.com/mitchwadair"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="color: rgba(0, 0, 0, 0.54)"
                        >Mitchell Adair</a
                    >
                </v-card-text>
            </v-card>
        </v-footer>
    </v-app>
</template>

<script>
import AppBarHeader from "./components/AppBarHeader.vue";
import ProfileBadge from "./components/ProfileBadge.vue";
import navItems from "./defaults/navitems.json";

export default {
    name: "App",

    components: {
        AppBarHeader,
        ProfileBadge,
    },

    data: function() {
        return {
            storeLoaded: false,
            sidebarItems: navItems,
            footerIcons: [
                { icon: "mdi-github", link: "https://github.com/mitchwadair/mthebot" },
                { icon: "mdi-linkedin", link: "https://www.linkedin.com/in/mitchell-adair/" },
                { icon: "mdi-twitch", link: "https://twitch.tv/mtheb_" },
            ],
        };
    },
    methods: {
        login: function() {
            this.$auth.login();
        },
    },
    created() {
        if (!localStorage.getItem("version") || localStorage.getItem("version") !== "scopeUpgrade3") {
            this.$auth.logout();
            localStorage.setItem("version", "scopeUpgrade3");
        }
        if (this.$auth.isAuthenticated()) {
            this.$store.commit("setUserData", this.$auth.getProfileData());
        }
        this.storeLoaded = true;
        if (sessionStorage.redirect) {
            const redirect = sessionStorage.redirect;
            delete sessionStorage.redirect;
            this.$router.replace(redirect).catch(() => {
                //do nothing
            });
        }
    },
};
</script>
