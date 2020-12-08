<template>
    <div>
        <v-container>
            <v-row>
                <v-col class='pt-0' align="center">
                    <h1 class='display-3'>About MtheBot_</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col class='pt-0'>
                    <v-card tile elevation="0" class='mx-12'>
                        <v-card-title class='headline'>What is MtheBot_?</v-card-title>
                        <v-card-text class='body-1'>
                            MtheBot_ is an 
                            <a href="https://github.com/mitchwadair/mthebot" target="_blank" rel="noopener noreferrer">open-source</a> 
                            project by 
                            <a href="https://github.com/mitchwadair" target="_blank" rel="noopener noreferrer">Mitchell Adair</a>
                            , aiming to build an easy-to-use chat bot for Twitch.  Chat bots on Twitch help to provide a rewarding and engaging experience for a broadcaster's 
                            viewers.  In order to provide such an experience, often times a broadcaster must do a lot of additional work and research to allow for complicated 
                            commands to work in their chat.  The goal of MtheBot_ is to minimize the amount of extra work a broadcaster must to in order to provide their chat 
                            with an enjoyable experience.  The project started as a way to make a uniquely customizable bot for my own 
                            <a href="https://www.twitch.tv/mtheb_" target="_blank" rel="noopener noreferrer">Twitch channel</a>.  
                            I quickly realized that I could generalize the bot and make it available for other people to use as well.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col class='pt-0'>
                    <v-card tile elevation="0" class='mx-12'>
                        <v-card-title class='headline'>How can I support MtheBot_?</v-card-title>
                        <v-card-text class='body-1'>
                            MtheBot_ is currently a one-man operation.  Because of this, I incur numerous monthly costs associated with keeping the bot running, which I currently
                            pay out of pocket.  These costs include domain registration and maintenance, server architechture, and more.  If you would like to help keep MtheBot_ 
                            running, you could consider supporting the project on <a href="https://github.com/sponsors/mitchwadair" target="_blank" rel="noopener noreferrer">GitHub Sponsors</a> 
                            or giving a <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=9WS3KJPAV8JDJ&currency_code=USD" target="_blank" rel="noopener noreferrer">
                            one-time donation</a>.  Anything is appreciated and will directly help the efforts being made not only to maintain MtheBot_, but also to allow me to dedicate 
                            more time to improving the bot and it's features.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col class='pt-0'>
                    <v-card tile elevation="0" class='d-flex flex-column mx-12'>
                        <v-card-title class='headline'>Report an Issue</v-card-title>
                        <v-card-text class='body-1'>
                            If you encounter an issue or bug, you can submit an issue on GitHub or contact me to get help resolving it.
                        </v-card-text>
                        <v-card-actions class='pt-0 pl-4 mt-auto'>
                            <v-btn outlined small href="https://github.com/mitchwadair/mthebot/issues" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-github</v-icon>Submit an Issue
                            </v-btn>
                            <v-btn outlined small @click="openContactDialog">
                                <v-icon left>mdi-email</v-icon>Contact
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card tile elevation="0" height="100%" class='d-flex flex-column mx-12'>
                        <v-card-title class=''>Contribute to MtheBot_</v-card-title>
                        <v-card-text>
                            MtheBot_ is an open-source project.  I welcome pull-requests to contribute to MtheBot_ on GitHub!
                        </v-card-text>
                        <v-card-actions class='pt-0 pl-4 mt-auto'>
                            <v-btn outlined small href="https://github.com/mitchwadair/mthebot" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-github</v-icon>MtheBot_ on GitHub
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card tile elevation="0" height="100%" class='d-flex flex-column mx-12'>
                        <v-card-title class=''>Support MtheBot_</v-card-title>
                        <v-card-text>
                            As I said above, MtheBot_ is a one-man operation.  Any support is greatly appreciated and keeps the bot up and running!
                        </v-card-text>
                        <v-card-actions class='pt-0 pl-4 mt-auto'>
                            <v-btn outlined small href="https://github.com/sponsors/mitchwadair" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-github</v-icon>GitHub Sponsors
                            </v-btn>
                            <v-btn outlined small href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=9WS3KJPAV8JDJ&currency_code=USD" target="_blank" rel="noopener noreferrer">
                                <v-icon left>mdi-gift</v-icon>Donate to MtheBot_
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'About',
    data: function() {
        return {

        };
    },
    methods: {
        openContactDialog: function() {
            this.$store.commit('setContactDialog', true);
        }
    },
}
</script>