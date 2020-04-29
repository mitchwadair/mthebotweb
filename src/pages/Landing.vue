<template>
    <div class='landing'>
        <h1 class='header display-4'>MtheBot_</h1>
        <span class='headline'>An easy-to-use chatbot for your Twitch channel</span>
        <div class='feature-container'>
            <v-carousel cycle show-arrows-on-hover hide-delimiter-background height="20rem">
                <v-carousel-item v-for="(slide, i) in slides" :key="i">
                    <v-sheet height="100%" tile>
                        <v-row class='fill-height' align="center">
                            <v-col align='center' justify="center">
                                <span class='headline'>{{slide.text}}</span>
                            </v-col>
                            <v-col align="center">
                                <v-img :src="slide.img" max-width="25rem" max-height="18rem"/>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>
        </div>
        <v-container>
            <v-row align="center">
                <v-col align="center">
                    <v-sheet elevation="4" height="10rem">
                        <h3 class='headline pt-3'>Get Started</h3>
                        <h4 class='subtitle-1 pb-2'>Login with Twitch to start improving your chat's experience!</h4>
                        <v-btn @click.prevent="login" depressed color="#6441A5" style="color: white; margin: auto">
                            <v-icon left>mdi-twitch</v-icon>Login
                        </v-btn>
                    </v-sheet>
                </v-col>
                <v-col align="center" justify="center">
                    <v-sheet elevation="4" height="10rem">
                        <h3 class='headline py-3'>Check out MtheBot_ on GitHub</h3>
                        <v-btn outlined class='my-2' href="https://github.com/mitchwadair/mthebot" target="_blank" rel="noopener noreferrer">
                            <v-icon left>mdi-github</v-icon>MtheBot_ GitHub
                        </v-btn>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import commandsGif from '../assets/commands.gif';
import logo from '../assets/logo.png';

export default {
    data: () => {
        return {
            slides: [
                {text: 'Custom Commands', img: commandsGif},
                {text: 'Chat Alerts', img: logo},
                {text: 'Timed Messages', img: logo},
            ]
        }
    },
    methods: {
        login: function() {
            this.$auth.login();
        }
    }
}
</script>

<style scoped>
.landing {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.header {
    padding: 3rem 0 2rem 0;
}
.feature-container {
    width: 800px;
    padding-top: 1.5rem;
}
</style>