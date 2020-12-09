<template>
    <div id="events">
        <v-container>
            <v-row>
                <v-col class='mx-3'>
                    <h1 class='display-2 font-weight-light'>Channel Events</h1>
                    <h2 class='subtitle-1 font-weight-light mx-2'>Configure the messages sent to chat by MtheBot_ for various channel events.</h2>
                </v-col>
            </v-row>
            <v-row v-if="loadingData">
                <v-col align="center">
                    <v-progress-circular indeterminate color="primary" size="100" width="8"/>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col class='px-0 px-md-3'>
                    <v-sheet tile elevation="4" class='mx-4'>
                        <v-list class='pt-0'>
                            <template v-for="(event, i) in channelData">
                                <v-list-item :key="'event' + i">
                                    <v-list-item-content>
                                        <v-list-item-title class='font-weight-medium'>
                                            {{eventLabels[event.name]}}
                                            <v-chip v-if="event.enabled" color="success" x-small label class='ml-2 px-2'>Enabled</v-chip>
                                            <v-chip v-else color="error" x-small label class='ml-2 px-2'>Disabled</v-chip>
                                        </v-list-item-title>
                                        <v-row class='mb-n4 mt-n2 flex-nowrap'>
                                            <v-col>
                                                <v-list-item-subtitle>Message</v-list-item-subtitle>
                                                "{{event.message}}"
                                            </v-col>
                                            <v-col class='flex-grow-0'>
                                                <v-menu offset-y left>
                                                    <template v-slot:activator="{on}">
                                                        <v-btn icon v-on="on" :ripple=false>
                                                            <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <v-list dense>
                                                        <v-list-item @click="cacheCurrentData(event); $set(modifyDialog, event.name, true);">
                                                            <v-list-item-content>
                                                                <v-list-item-title>Modify</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                        <v-list-item @click="flipEventStatus(event)">
                                                            <v-list-item-content>
                                                                <v-list-item-title>{{event.enabled ? 'Disable' : 'Enable'}}</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                                <v-dialog v-model="modifyDialog[event.name]" attach="#events" persistent max-width="50rem">
                                                    <v-card>
                                                        <v-card-title>Modify {{eventLabels[event.name]}}</v-card-title>
                                                        <v-card-subtitle>Update the message displayed when a {{eventLabels[event.name]}} happens.</v-card-subtitle>
                                                        <v-card-text align="right">
                                                            <v-menu offset-y left close-on-click open-on-hover>
                                                                <template v-slot:activator="{on}">
                                                                    <v-btn text outlined v-on="on" :ripple=false>
                                                                        Insert Data Tag
                                                                    </v-btn>
                                                                </template>

                                                                <v-list dense>
                                                                    <v-list-item v-for='tag in dataTags.general' :key='tag.label' @click="insertDataTag(tag, i)">
                                                                        <v-tooltip left nudge-left=10>
                                                                            <template v-slot:activator="{on}">
                                                                                <v-list-item-content v-on="on">
                                                                                    <v-list-item-title>{{tag.label}}</v-list-item-title>
                                                                                </v-list-item-content>
                                                                            </template>
                                                                            <span>{{tag.info}}</span>
                                                                        </v-tooltip>
                                                                    </v-list-item>
                                                                    <v-list-item v-for='tag in dataTags[event.name]' :key='tag.label' @click="insertDataTag(tag, i)">
                                                                        <v-tooltip left nudge-left=10>
                                                                            <template v-slot:activator="{on}">
                                                                                <v-list-item-content v-on="on">
                                                                                    <v-list-item-title>{{tag.label}}</v-list-item-title>
                                                                                </v-list-item-content>
                                                                            </template>
                                                                            <span>{{tag.info}}</span>
                                                                        </v-tooltip>
                                                                    </v-list-item>
                                                                </v-list>
                                                            </v-menu>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            <v-form v-model="modifyValid[i]">
                                                                <v-textarea
                                                                    v-model="event.message"
                                                                    hide-details="auto"
                                                                    label="Message"
                                                                    maxlength="500"
                                                                    :ref="'textarea' + i"
                                                                    :rules="[validationRules.required]"
                                                                    outlined dense counter auto-grow required/>
                                                            </v-form>
                                                        </v-card-text>
                                                        <v-card-actions>
                                                            <v-spacer/>
                                                            <v-btn color="primary" text @click="$set(modifyDialog, event.name, false); cancelModify()">Cancel</v-btn>
                                                            <v-btn color="primary" text @click="if (modifyValid[i]) {updateData(event)}">Save</v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                    <v-overlay :value="isSending" opacity=".15" absolute>
                                                        <v-progress-circular indeterminate color="primary" size="64"/>
                                                    </v-overlay>
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
import validationRules from '../defaults/validationRules';

export default {
    name: 'Events',
    data: function() {
        return {
            dataTags: {
                general: [
                    {label: 'User', tag: '{{user}}', info: 'The user the action originated from'},
                ],
                raid: [
                    {label: 'Viewers', tag: '{{viewers}}', info: 'The number of viewers in the raid'},
                ],
                host: [
                    {label: 'Viewers', tag: '{{viewers}}', info: 'The number of viewers in the host'},
                ],
                sub: [
                    {label: 'Sub Type', tag: '{{type}}', info: 'The subscription type'},
                ],
                resub: [
                    {label: 'Total Months', tag: '{{months}}', info: 'The total number of months subbed'},
                    {label: 'Streak', tag: '{{streak}}', info: 'The current number of months in the sub streak'},
                    {label: 'Sub Type', tag: '{{type}}', info: 'The subscription type'},
                ],
                subgift: [
                    {label: 'Total Gifts', tag: '{{total}}', info: 'The total number of subs gifted by the user'},
                    {label: 'Streak', tag: '{{streak}}', info: 'The current number of months in the sub streak'},
                    {label: 'Recipient', tag: '{{recipient}}', info: 'The user who received the sub gift'},
                    {label: 'Sub Type', tag: '{{type}}', info: 'The subscription type'},
                ],
                giftupgrade: [
                    {label: 'Sub Gifter', tag: '{{gifter}}', info: 'The original gifter of the subscription'},
                ],
                mysterygift: [
                    {label: 'Total Gifts', tag: '{{total}}', info: 'The total number of subs gifted by the user'},
                    {label: 'Number of Subs', tag: '{{count}}', info: 'The number of subs gifted at this time'},
                    {label: 'Sub Type', tag: '{{type}}', info: 'The subscription type'},
                ],
                anongiftupgrade: [],
                cheer: [
                    {label: 'Cheer Amount', tag: '{{amount}}', info: 'The amount of bits cheered'},
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
            channelData: {},
            dataCache: {},
            modifyDialog: {},
            modifyValid: {},
            validationRules: validationRules,
            loadingData: true,
            isSending: false,
            responseError: null,
        };
    },
    methods: {
        enableBot: function() {
            const channel = this.$store.state.userData.id;
            this.axios.post(`/chats/${channel}`, {}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
                if (res.status === 200) {
                    this.$router.go();
                }
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        flipEventStatus: function(event) {
            const channel = this.$store.state.userData.id;
            event.enabled = !event.enabled;
            this.axios.put(`/events/${channel}/${event.name}`, {message: event.message, enabled: event.enabled}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
            }).catch(() => {
                this.isSending = false;
                event.enabled = !event.enabled;
            });
        },
        cacheCurrentData: function(event) {
            this.responseError = null;
            this.dataCache = JSON.parse(JSON.stringify(event));
        },
        updateData: function(eventData) {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            this.axios.put(`/events/${channel}/${this.dataCache.name}`, {message: eventData.message, enabled: eventData.enabled}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.modifyDialog[eventData.name] = false;
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        },
        cancelModify: function() {
            let undo = this.channelData.find(e => e.name === this.dataCache.name);
            undo.name = this.dataCache.name;
            undo.message = this.dataCache.message;
            undo.enabled = this.dataCache.enabled;
        },
        insertDataTag: function(tag, index) {
            const el = this.$refs[`textarea${index}`][0].$el.querySelector('textarea');

            let cursorPos = el.selectionEnd;
            this.channelData[index].message = `${this.channelData[index].message.substring(0, cursorPos)}${tag.tag}${this.channelData[index].message.substring(cursorPos)}`;

            cursorPos += tag.tag.length;
            this.$nextTick(() => {
                el.focus();
                el.selectionEnd = cursorPos;
            });
        }
    },
    mounted() {
        const channel = this.$store.state.userData.id;
        this.axios.get(`/events/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
            this.channelData = res.data;
            this.loadingData = false;
        }).catch(err => {
            this.loadingData = false;
            console.log(`ERROR: ${err}`);
        });
    },
}
</script>