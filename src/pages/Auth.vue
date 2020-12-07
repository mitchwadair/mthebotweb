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
                let newData = {...res.data};
                delete newData['session_token'];
                this.$store.commit('setUserData', newData);
                this.$router.replace('/dashboard');
            });
        } else {
            console.log('test')
            this.$router.replace('/');
        }
    }
}
</script>