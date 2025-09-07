<template>
    <div v-on:click='goHome' id='appHeader'>
        <img
            alt="MtheBot_ Logo"
            class="mr-2"
            :src="logo"
            width="40"
        />
        <v-toolbar-title>MtheBot_</v-toolbar-title>
    </div>
</template>

<script>
export default {
    name: 'app-bar-header',
    data() {
        return {
            logo: new URL('../assets/logo.png', import.meta.url).href,
        };
    },

    methods: {
        goHome: function() {
            if (this.$router.currentRoute.path !== '/') {
                this.$router.push({path: '/'})
            }
        }
    }
}
</script>

<style>
#appHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
}

#appHeader:hover {
    cursor: pointer;
}
</style>
