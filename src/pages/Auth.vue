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
            this.axios.get('https://api.twitch.tv/helix/users', {headers: {'Authorization': `Bearer ${this.$auth.accessToken}`}})
                .then(res => {
                    this.$auth.profileData = JSON.stringify(res.data.data[0]);
                    this.$router.push('/dashboard');
                    this.$router.go();
                });
        } else {
            this.$router.push('/');
        }
    }
}
</script>