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
                    this.axios.get(`/chats/${this.$store.state.userData.id}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
                        if (res.status === 404) {
                            this.$router.replace('/dashboard');
                            return;
                        }
                        this.axios.post(`/auth/${this.$store.state.userData.id}`, {token: token}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                            this.$router.replace('/dashboard');
                        });
                    }).catch(err => {
                        if (err.response.status === 404) {
                            this.$router.replace('/dashboard');
                            return;
                        }
                        console.log(`ERROR: ${err}`);
                    });
                }).catch(err => {
                    this.$auth.logout();
                    this.$router.push(`/?error=login&message=${err.response.data.message}`);
                    this.$router.go();
                });
        } else {
            this.$router.replace('/');
        }
    }
}
</script>