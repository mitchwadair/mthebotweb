<template>
    <div v-on:click='goHome' id='appHeader'>
        <v-img
            alt="MtheBot_ Logo"
            class="shrink mr-2"
            contain
            :src="require('../assets/logo.png')"
            transition="scale-transition"
            width="30"
        />
        <v-toolbar-title>MtheBot_</v-toolbar-title>
    </div>
</template>

<script>
    export default {
        name: 'app-bar-header',

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
}

#appHeader:hover {
    cursor: pointer;
}
</style>