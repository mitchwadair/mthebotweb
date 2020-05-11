<template>
    <div class='landing'>
        <v-alert v-if="errorData && errorData.get('error')" dense outlined dismissible type="error" class='top-error'>
            {{errors[errorData.get('error')]}}:{{errorData.get('message')}}
        </v-alert>
        <h1 class='header display-4'>MtheBot_</h1>
        <span class='headline'>An easy-to-use chatbot for your Twitch channel</span>
        <div class='feature-container'>
            <!--v-carousel cycle show-arrows-on-hover hide-delimiter-background height="20rem">
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
            </v-carousel-->
        </div>
        <v-container>
            <v-row>
                <v-spacer/>
                <v-col align="center" justify="center">
                    <v-card flat height="100%" class='d-flex flex-column'>
                        <v-card-title class='justify-center'>MtheBot_ Project</v-card-title>
                        <v-card-text>
                            MtheBot_ is an open-source project by 
                            <a href="https://github.com/mitchwadair" target="_blank" rel="noopener noreferrer">Mitchell Adair</a>
                        </v-card-text>
                        <v-card-text class='pt-0 mt-auto'>
                            <v-btn outlined href="https://github.com/mitchwadair/mthebot" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-github</v-icon>MtheBot_ on GitHub
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col align="center" justify="center">
                    <v-card flat height="100%" class='d-flex flex-column'>
                        <v-card-title class='justify-center'>Get Started</v-card-title>
                        <v-card-text>Login with Twitch to start improving your chat's experience!</v-card-text>
                        <v-card-text class='pt-0 mt-auto'>
                            <v-btn @click="login" depressed color="#6441A5" style="color: white">
                                <v-icon left>mdi-twitch</v-icon>Login
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col align="center" justify="center">
                    <v-card flat height="100%" class='d-flex flex-column'>
                        <v-card-title class='justify-center'>Support MtheBot_</v-card-title>
                        <v-card-text>
                            MtheBot_ is currently being developed by a one-person team, and being paid for out-of-pocket.  Any help supporting the project is appreciated!
                        </v-card-text>
                        <v-card-text class='pt-0 mt-auto'>
                            <v-btn outlined href="https://www.patreon.com/mitchdev" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-patreon</v-icon>MtheBot_ on Patreon
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-spacer/>
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
            ],
            errors: {
                login: "There was an error logging you in",
            },
        }
    },
    computed: {
        errorData() {
            return new URLSearchParams(window.location.search)
        }
    },
    methods: {
        login: function() {
            this.$auth.login();
        }
    },
}
</script>

<style scoped>
.landing {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.header {
    padding: 2rem 0 2rem 0;
}
.feature-container {
    width: 800px;
    padding-top: 1.5rem;
}

.top-error {
    position: absolute;
    top: .5rem;
}
</style>