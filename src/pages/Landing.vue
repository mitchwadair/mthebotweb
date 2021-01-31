<template>
    <div id='landing'>
        <v-container>
            <v-row v-if="errorData && errorData.get('error')" class='justify-center align-center mx-auto mt-10' style='max-width: 1000px'>
                <v-alert dense outlined dismissible type="error" class='top-error'>
                    {{errors[errorData.get('error')]}}:{{errorData.get('message')}}
                </v-alert>
            </v-row>
            <v-row class='justify-center align-center mx-auto mt-10' style='max-width: 1000px'>
                <h1 align='center' class='display-2 font-weight-light'>MtheBot_</h1>
                <v-img src="../assets/logo.png" max-width="75px" class='ml-4'></v-img>
            </v-row>
            <v-row class='justify-center mx-auto' style='max-width: 1000px'>
                <h2 class='headline font-weight-light'>An easy-to-use chatbot for your Twitch channel</h2>
            </v-row>
            <v-row class='justify-center py-10 mx-auto' style='max-width: 800px'>
                <p align='center' class='body-1 font-weight-light'>
                    MtheBot_ is a chatbot for Twitch that aims to make it easier for you, the streamer, to get your channel up and running.  Make your chat
                    interactive and fun with little effort!
                </p>
            </v-row>
            <v-row class='justify-center mx-auto' style='max-width: 1000px'>
                <v-btn @click="login" depressed large color="#6441A5" style="color: white" class='ma-2'>
                    <v-icon left>mdi-twitch</v-icon>Login
                </v-btn>
                <v-btn @click="scrollToFeatures" outlined large class='ma-2'>Features</v-btn>
                <v-btn @click="scrollToSupport" outlined large class='ma-2'>Support MtheBot_</v-btn>
            </v-row>
            <v-divider class='mt-10 mx-auto' style='max-width: 1000px'/>
            <v-row class='justify-center mx-auto pt-10' style='max-width: 1000px'>
                <v-col class='flex-grow-0'>
                    <h2 id='features' class='display-1 font-weight-thin'>Features</h2>
                    <v-divider class='mx-4 mt-4'/>
                </v-col>
            </v-row>
            <v-row class='justify-center mx-auto' style='max-width: 1000px'>
                <v-col cols='auto' sm='7' md='6'>
                    <v-card color='rgba(0, 0, 0, 0)' flat align='center'>
                        <v-row class='justify-center'><v-icon color='primary' size='75' class='mx-auto'>mdi-cloud</v-icon></v-row>
                        <v-card-title class='justify-center title font-weight-light pt-0'>Hosted in the Cloud</v-card-title>
                        <v-card-text class='body-2 font-weight-light'>
                            MtheBot_ is hosted in the cloud.  We take care of hosting so you do not have to!  
                            That means it is always on with little to no downtime with no extra setup for you.
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols='auto' sm='7' md='6'>
                    <v-card color='rgba(0, 0, 0, 0)' flat align='center'>
                        <v-row class='justify-center'><v-icon color='primary' size='75' class='mx-auto'>mdi-wrench</v-icon></v-row>
                        <v-card-title class='justify-center title font-weight-light pt-0'>Commands</v-card-title>
                        <v-card-text class='body-2 font-weight-light'>
                            Create commands for use in your channel.  MtheBot_ makes it easy to add variable data to your commands as well.  
                            Easily create commands like !uptime or !followage without any technical knowledge.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class='justify-center mx-auto' style='max-width: 1000px'>
                <v-col cols='auto' sm='7' md='6'>
                    <v-card color='rgba(0, 0, 0, 0)' flat align='center'>
                        <v-row class='justify-center'><v-icon color='primary' size='75' class='mx-auto'>mdi-alert-circle-check</v-icon></v-row>
                        <v-card-title class='justify-center title font-weight-light pt-0'>Events</v-card-title>
                        <v-card-text class='body-2 font-weight-light'>
                            Have MtheBot_ chat out a message each time an important event happens.  Give a subscriber or cheerer a shoutout, 
                            or thank someone for a host or raid.
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols='auto' sm='7' md='6'>
                    <v-card color='rgba(0, 0, 0, 0)' flat align='center'>
                        <v-row class='justify-center'><v-icon color='primary' size='75' class='mx-auto'>mdi-timer</v-icon></v-row>
                        <v-card-title class='justify-center title font-weight-light pt-0'>Timers</v-card-title>
                        <v-card-text class='body-2 font-weight-light'>
                            Send timed chat messages for your viewers to see.  Remind them of your chat rules, or plug your social media.  
                            Having a sponsored stream?  Ensure your chat can visit your sponsor's site.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class='justify-center mx-auto' style='max-width: 1000px'>
                <v-col cols='auto' sm='7' md='6'>
                    <v-card color='rgba(0, 0, 0, 0)' flat align='center'>
                        <v-row class='justify-center'><v-icon color='primary' size='75' class='mx-auto'>mdi-tag</v-icon></v-row>
                        <v-card-title class='justify-center title font-weight-light pt-0'>Data Tags</v-card-title>
                        <v-card-text class='body-2 font-weight-light'>
                            Make your bot dynamic with data tags.  Apply event-specific data to your event responses, or add dynamic information 
                            to your commands.  Currently supporting Twitch-related data with plans on expanding to other services.
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-divider class='mt-10 mx-auto' style='max-width: 1000px'/>
            <v-row class='justify-center mx-auto pt-10' style='max-width: 1000px'>
                <v-spacer/>
                <v-col align='center'>
                    <h2 id='support' class='display-1 font-weight-thin'>Support MtheBot_</h2>
                    <v-divider class='mx-4 mt-4' style='max-width: 200px'/>
                </v-col>
                <v-spacer/>
            </v-row>
            <v-row class='justify-center mx-auto pt-4' style='max-width: 1000px'>
                <v-col class='d-flex align-center'>
                    <p class='body-1 font-weight-light'>
                        MtheBot_ is currently being developed by a one-person team, and being paid for out-of-pocket.  Because of this, 
                        I incur numerous monthly costs associated with keeping the bot running.  These costs include domain registration 
                        and maintenance, server architechture, and more.  Any help keeping it running is greatly appreciated!
                    </p>
                </v-col>
                <v-col>
                    <v-card color='rgba(0, 0, 0, 0)' flat>
                        <v-list-item three-line>
                            <v-list-item-avatar size='75'><v-icon size='75'>mdi-github</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>Sponsor on GitHub</v-list-item-title>
                                <v-list-item-subtitle>Similar to Patreon, give a monthly subscription to help support MtheBot_</v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    <v-btn small color='primary' text href="https://github.com/sponsors/mitchwadair" target="_blank" rel="noopener noreferrer">
                                        Go to GitHub Sponsors
                                    </v-btn>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                    <v-card flat color='rgba(0, 0, 0, 0)' class='mt-2'>
                        <v-list-item three-line>
                            <v-list-item-avatar size='75'><v-icon size='75'>mdi-gift</v-icon></v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>Donate</v-list-item-title>
                                <v-list-item-subtitle>Give a donation to MtheBot_ through PayPal</v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    <v-btn small color='primary' text href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=9WS3KJPAV8JDJ&currency_code=USD" target="_blank" rel="noopener noreferrer">
                                        Give a Donation
                                    </v-btn>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            errors: {
                login: "There was an error logging you in",
                auth: "You have been logged out due to an authentication error",
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
        },
        scrollToFeatures: function() {
            document.getElementById('features').scrollIntoView({behavior: 'smooth'})
        },
        scrollToSupport: function() {
            document.getElementById('support').scrollIntoView({behavior: 'smooth'})
        }
    },
}
</script>

<style scoped>
.top-error {
    position: absolute;
    top: .5rem;
}
</style>