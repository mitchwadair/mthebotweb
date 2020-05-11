<template>
    <div id="events">
        <v-container>
            <v-row>
                <v-col>
                    <h1 class='display-2 font-weight-light'>Channel Events</h1>
                    <h2 class='subtitle-1 font-weight-light'>Configure the messages sent to chat by MtheBot_ for various channel events.</h2>
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
                    <v-sheet tile elevation="4" class='mx-4'>
                        <v-list>
                            <template v-for="(event, name, i) in channelData">
                                <v-list-item :key="name">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{eventLabels[name]}}
                                        </v-list-item-title>
                                        <v-row>
                                            <v-col style="flex-grow: 0">
                                                <v-list-item-subtitle>Enabled</v-list-item-subtitle>
                                                <v-checkbox dense hide-details="auto" v-model="event.enabled" v-on:change="updateData" class="mt-0 pt-0"/>
                                            </v-col>
                                            <v-col>
                                                <v-list-item-subtitle>Message</v-list-item-subtitle>
                                                "{{event.message}}"
                                            </v-col>
                                            <v-col style="flex-grow: 0">
                                                <v-dialog v-model="modifyDialog[name]" attach="#events" persistent max-width="50rem">
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn color="primary" v-on="on" @click="cacheCurrentData">Modify</v-btn>
                                                    </template>
                                                    <v-card>
                                                        <v-card-title>Modify {{eventLabels[name]}}</v-card-title>
                                                        <v-card-text>
                                                            <v-text-field v-model="event.message" hide-details="auto" label="Message" outlined dense></v-text-field>
                                                        </v-card-text>
                                                        <v-card-actions>
                                                            <v-spacer/>
                                                            <v-btn color="primary" text @click.stop="$set(modifyDialog, name, false); cancelModify()">Cancel</v-btn>
                                                            <v-btn color="primary" text @click.stop="$set(modifyDialog, name, false); updateData()">Save</v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </v-col>
                                        </v-row>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider v-if="i < Object.keys(channelData).length - 1" :key="i" class='mx-4'/>
                            </template>
                        </v-list>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import defaultEvents from '../defaults/events.json';

export default {
    name: 'Events',
    data: function() {
        return {
            dataTags: {
                general: [
                    {label: 'User', tag: '{{user}}'},
                ],
                raid: [
                    {label: 'Viewers', tag: '{{viewers}}'},
                ],
                host: [
                    {label: 'Viewers', tag: '{{viewers}}'},
                ],
                sub: [
                    {label: 'Sub Type', tag: '{{type}}'},
                ],
                resub: [
                    {label: 'Total Months', tag: '{{months}}'},
                    {label: 'Streak', tag: '{{streak}}'},
                    {label: 'Sub Type', tag: '{{type}}'},
                ],
                subgift: [
                    {label: 'Total Gifts', tag: '{{total}}'},
                    {label: 'Streak', tag: '{{streak}}'},
                    {label: 'Recipient', tag: '{{recipient}}'},
                    {label: 'Sub Type', tag: '{{type}}'},
                ],
                giftupgrade: [
                    {label: 'Sub Gifter', tag: '{{gifter}}'},
                ],
                mysterygift: [
                    {label: 'Total Gifts', tag: '{{total}}'},
                    {label: 'Number of Subs', tag: '{{count}}'},
                    {label: 'Sub Type', tag: '{{type}}'},
                ],
                anongiftupgrade: [],
                cheer: [
                    {label: 'Cheer Amount', tag: '{{amount}}'},
                ]
            },
            eventLabels: {
                raid: 'Raid',
                host: 'Host',
                sub: 'Subscription',
                resub: 'Resub',
                subgift: 'Gifted Sub',
                giftupgrade: 'Gifted Sub Continued',
                mysterygift: 'Mystery Gift Subscription',
                anongiftupgrade: 'Anonymous Gifted Sub Continued',
                cheer: 'Cheer'
            },
            channelExists: false,
            dataFetched: false,
            channelData: {},
            dataCache: {},
            modifyDialog: {},
        };
    },
    methods: {
        enableBot: function() {
            const channel = this.$store.state.userData.login;
            let promises = []
            promises.push(this.axios.post(`https://api.bot.mtheb.tv/commands/${channel}`, {}));
            promises.push(this.axios.post(`https://api.bot.mtheb.tv/timers/${channel}`, {}));
            promises.push(this.axios.post(`https://api.bot.mtheb.tv/events/${channel}`, defaultEvents));
            Promise.all(promises).then(() => {
                this.axios.post(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
                    if (res.status === 200) {
                        this.channelExists = true;
                    }
                });
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        cacheCurrentData: function() {
            this.dataCache = JSON.parse(JSON.stringify(this.channelData));
        },
        updateData: function() {
            const channel = this.$store.state.userData.login;
            this.axios.post(`https://api.bot.mtheb.tv/events/${channel}`, this.channelData).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        cancelModify: function() {
            this.channelData = JSON.parse(JSON.stringify(this.dataCache));
        }
    },
    mounted() {
        const channel = this.$store.state.userData.login;
        this.axios.get(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
            if (res.status === 404) {
                this.channelExists = false;
                return;
            }
            this.axios.get(`https://api.bot.mtheb.tv/events/${channel}`).then(res => {
                this.channelData = res.data;
                this.channelExists = true;
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        });
    },
}
</script>