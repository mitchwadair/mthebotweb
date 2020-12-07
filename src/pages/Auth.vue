<template>
    <div></div>
</template>

<script>
export default {
    mounted: function() {
        const code = this.$route.query.code;
        if (code) {
            this.axios.post('/auth', {code: code}).then(res => {
                this.$auth.accessToken = res.data.session_token;
                this.$store.commit('setUserData', res.data.user_data);
                this.$router.replace('/dashboard');
            });
        } else {
            console.log('test')
            this.$router.replace('/');
        }
    }
}
</script>