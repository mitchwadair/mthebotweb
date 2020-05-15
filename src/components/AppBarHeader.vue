<template>
    <div v-on:click='goHome' id='appHeader'>
        <img
            alt="MtheBot_ Logo"
            class="mr-2"
            :src="require('../assets/logo.png')"
            width="40"
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
    align-items: center;
}

#appHeader:hover {
    cursor: pointer;
}
</style>