<template>
    <div class='landing'>
        <v-alert v-if="errorData && errorData.get('error')" dense outlined dismissible type="error" class='top-error'>
            {{errors[errorData.get('error')]}}:{{errorData.get('message')}}
        </v-alert>
        <h1 class='header display-4'>MtheBot_</h1>
        <span class='headline'>An easy-to-use chatbot for your Twitch channel</span>
        <v-container>
            <v-row>
                <v-col align="center" justify="center">
                    <v-card flat height="100%" class='d-flex flex-column'>
                        <v-card-title class='justify-center'>MtheBot_ Project</v-card-title>
                        <v-card-text>
                            MtheBot_ is an open-source project by 
                            <a href="https://github.com/mitchwadair" target="_blank" rel="noopener noreferrer">Mitchell Adair</a>
                        </v-card-text>
                        <v-card-actions class='pt-0 mt-auto'>
                            <v-spacer/>
                            <v-btn outlined href="https://github.com/mitchwadair/mthebot" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-github</v-icon>MtheBot_ on GitHub
                            </v-btn>
                            <v-spacer/>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col align="center" justify="center">
                    <v-card flat height="100%" class='d-flex flex-column'>
                        <v-card-title class='justify-center'>Get Started</v-card-title>
                        <v-card-text>Login with Twitch to start improving your chat's experience!</v-card-text>
                        <v-card-actions class='pt-0 mt-auto'>
                            <v-spacer/>
                            <v-btn @click="login" depressed color="#6441A5" style="color: white">
                                <v-icon left>mdi-twitch</v-icon>Login
                            </v-btn>
                            <v-spacer/>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col align="center" justify="center">
                    <v-card flat height="100%" class='d-flex flex-column'>
                        <v-card-title class='justify-center'>Support MtheBot_</v-card-title>
                        <v-card-text>
                            MtheBot_ is currently being developed by a one-person team, and being paid for out-of-pocket.  Any help supporting the project is appreciated!
                        </v-card-text>
                        <v-card-actions class='pt-0 mt-auto'>
                            <v-spacer/>
                            <v-btn outlined href="https://www.patreon.com/mitchdev" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-patreon</v-icon>MtheBot_ on Patreon
                            </v-btn>
                            <v-spacer/>
                        </v-card-actions>
                    </v-card>
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
.top-error {
    position: absolute;
    top: .5rem;
}
</style>