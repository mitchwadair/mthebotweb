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
                    this.$auth.profileData = JSON.stringify(res.data.data[0]);
                    this.$router.push('/dashboard');
                    this.$router.go();
                }).catch(err => {
                    this.$auth.logout();
                    console.log(err);
                    this.$router.push(`/?error=login&message=${err.response.data.message}`);
                    this.$router.go();
                });
        } else {
            this.$router.push('/');
        }
    }
}
</script>