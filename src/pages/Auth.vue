<template>
    <div></div>
</template>

<script>
export default {
    mounted: function() {
        const hash = window.location.hash;
        if (hash !== '') {
            const token = hash.substring(1).split('&')[0].split('=')[1];
            this.$auth.accessToken = token;
            this.$auth.getProfileData()
                .then(res => {
                    this.$store.commit('setUserData', res.data.data[0]);
                    this.axios.get(`/chats/${this.$store.state.userData.login}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
                        if (res.status === 404) {
                            this.$router.push('/dashboard');
                            return;
                        }
                        this.axios.post(`/auth/${this.$store.state.userData.login}`, {token: token}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                            this.$router.push('/dashboard');
                        });
                    }).catch(err => {
                        if (err.response.status === 404) {
                            this.$router.push('/dashboard');
                            return;
                        }
                        console.log(`ERROR: ${err}`);
                    });
                }).catch(err => {
                    this.$auth.logout();
                    this.$router.push(`/?error=login&message=${err.response.data.message}`);
                });
        } else {
            this.$router.push('/');
        }
    }
}
</script>