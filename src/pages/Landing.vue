<template>
    <div style="text-align: center">
        <h1 class='display-4'>Coming soon</h1>
        <v-img
            :src="require('../assets/logo.png')"
            width="500"
            style="margin: 2rem auto"
        />
    </div>
</template>

<script>
export default {
    created() {
        if (this.$auth.isAuthenticated()) {
            this.$router.push('/dashboard');
        }
    }
}
</script>