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
            console.log(this.$auth.accessToken);
            this.$auth.getProfileData()
                .then(res => {
                    console.log(res);
                    this.$store.commit('setUserData', res.data.data[0]);
                    this.$router.push('/dashboard');
                }).catch(err => {
                    this.$auth.logout();
                    console.log(err)
                    this.$router.push(`/?error=login&message=${err.response.data.message}`);
                });
        } else {
            this.$router.push('/');
        }
    }
}
</script>