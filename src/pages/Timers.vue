<template>
    <div id='timers'>
        <v-container>
            <v-row>
                <v-col class='mx-3'>
                    <h1 class='display-2 font-weight-light'>Channel Timers</h1>
                    <h2 class='subtitle-1 font-weight-light mx-2'>Configure the timed messages sent to your chat by MtheBot_!</h2>
                </v-col>
            </v-row>
            <v-row v-if="!channelExists">
                <v-col>
                    <v-card flat>
                        <v-card-title>Channel Not Activated</v-card-title>
                        <v-card-text>
                            Looks like you haven't enabled MtheBot_ on your channel for the first time.
                            In order to modify MtheBot_ for your channel, you must enable it first.
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="enableBot" text color="primary">Enable MtheBot_</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-spacer/>
            </v-row>
            <v-row v-else>
                <v-col>
                    <v-sheet tile elevation="4" class='mx-12'>
                        <v-list>
                            <template v-for="(timer, i) in channelData">
                                 <v-list-item :key="'timer' + i">
                                     <v-list-item-content>
                                         <v-list-item-title class='font-weight-medium'>{{timer.name}}</v-list-item-title>
                                         <v-row class='mb-n4 mt-n2'>
                                             <v-col style="word-break: break-word">
                                                <v-list-item-subtitle>Message</v-list-item-subtitle>
                                                "{{timer.message}}"
                                            </v-col>
                                            <v-col class='flex-grow-0 text-no-wrap'>
                                                <v-list-item-subtitle>Interval</v-list-item-subtitle>
                                                {{timer.seconds}} seconds
                                            </v-col>
                                            <v-col class='flex-grow-0'>
                                                <v-list-item-subtitle>Message Threshold</v-list-item-subtitle>
                                                {{timer.messageThreshold}}
                                            </v-col>
                                            <v-col class='flex-grow-0'>
                                                <v-dialog v-model="modifyDialog[i]" attach="#timers" persistent max-width="50rem">
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn color="primary" v-on="on" @click="cacheCurrentData">Modify</v-btn>
                                                    </template>
                                                    <v-card>
                                                        <v-card-title>Modify {{timer.name}}</v-card-title>
                                                        <v-card-subtitle>Update the properties of the {{timer.name}} timer.</v-card-subtitle>
                                                        <v-card-text class='mb-n4'>
                                                            <v-text-field 
                                                                v-model="timer.name"
                                                                label="Name"
                                                                hide-details="auto"
                                                                maxlength="15"
                                                                outlined dense counter
                                                                class='flex-grow-0'/>
                                                        </v-card-text>
                                                        <v-card-text class='mb-n4'>
                                                            <v-text-field
                                                                v-model="timer.message"
                                                                label="Message"
                                                                hide-details="auto"
                                                                maxlength="500"
                                                                outlined dense counter/>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            <v-text-field
                                                                type="number"
                                                                v-model="timer.seconds"
                                                                label="Message Interval"
                                                                suffix="seconds"
                                                                hide-details="auto"
                                                                min="0"
                                                                outlined dense/>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            <v-text-field
                                                                type="number"
                                                                v-model="timer.messageThreshold"
                                                                label="Message Threshold"
                                                                hint="The number of chats required before being able to send the timed message"
                                                                suffix="seconds"
                                                                hide-details="auto"
                                                                min="0"
                                                                outlined dense/>
                                                        </v-card-text>
                                                        <v-card-actions>
                                                            <v-spacer/>
                                                            <v-btn color="primary" text @click.stop="$set(modifyDialog, i, false); cancelModify()">Cancel</v-btn>
                                                            <v-btn color="primary" text @click.stop="$set(modifyDialog, i, false); updateData()">Save</v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </v-col>
                                         </v-row>
                                     </v-list-item-content>
                                 </v-list-item>
                            </template>
                        </v-list>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Timers",
    data: function() {
        return {
            channelExists: false,
            channelData: {},
            dataCache: {},
            modifyDialog: {},
        };
    },
    methods: {
        enableBot: function() {
            const channel = this.$store.state.userData.login;
            this.axios.post(`https://api.bot.mtheb.tv/init/${channel}`, {}).then(res => {
                if (res.status === 200) {
                    this.botStatus = true;
                }
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        cacheCurrentData: function() {
            this.dataCache = JSON.parse(JSON.stringify(this.channelData));
        },
        updateData: function() {
            const channel = this.$store.state.userData.login;
            this.axios.post(`https://api.bot.mtheb.tv/timers/${channel}`, this.channelData).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        cancelModify: function() {
            this.channelData = JSON.parse(JSON.stringify(this.dataCache));
        },
    },
    mounted() {
        const channel = this.$store.state.userData.login;
        this.axios.get(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
            if (res.status === 404) {
                this.channelExists = false;
                return;
            }
            this.axios.get(`https://api.bot.mtheb.tv/timers/${channel}`).then(res => {
                this.channelData = res.data;
                this.channelExists = true;
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        });
    },
}
</script>