<template>
    <div id="events">
        <v-dialog v-model="modifyDialog" attach="#events" persistent max-width="50rem">
            <v-card>
                <v-card-title>Modify {{eventLabels[newEventData.name]}}</v-card-title>
                <v-card-subtitle>Update the message displayed when a {{eventLabels[newEventData.name]}} happens.</v-card-subtitle>
                <v-card-text align="right">
                    <v-menu offset-y left close-on-click open-on-hover>
                        <template v-slot:activator="{on}">
                            <v-btn text outlined v-on="on" :ripple=false>
                                Insert Data Tag
                            </v-btn>
                        </template>

                        <v-list dense>
                            <v-list-item v-for='tag in dataTags.general' :key='tag.label' @click="insertDataTag(tag)">
                                <v-tooltip left nudge-left=10>
                                    <template v-slot:activator="{on}">
                                        <v-list-item-content v-on="on">
                                            <v-list-item-title>{{tag.label}}</v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                    <span>{{tag.info}}</span>
                                </v-tooltip>
                            </v-list-item>
                            <v-list-item v-for='tag in dataTags[newEventData.name]' :key='tag.label' @click="insertDataTag(tag)">
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
                    <v-form v-model="modifyValid">
                        <v-textarea
                            v-model="newEventData.message"
                            hide-details="auto"
                            label="Message"
                            maxlength="500"
                            :ref="'modify-textarea'"
                            :rules="[validationRules.required]"
                            outlined dense counter auto-grow required/>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" text @click="cancelModify()">Cancel</v-btn>
                    <v-btn color="primary" text @click="{if (modifyValid) {updateData()}}">Save</v-btn>
                </v-card-actions>
            </v-card>
            <v-overlay :value="isSending" opacity=".15" absolute>
                <v-progress-circular indeterminate color="primary" size="64"/>
            </v-overlay>
        </v-dialog>
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
                <v-col class='mx-2'>
                    <v-sheet tile elevation="0" class='mx-auto flex-grow-1' style='background-color: rgba(0, 0, 0, 0); max-width: 600px'>
                        <template v-for="(event, i) in channelData">
                            <v-card :key="'event' + i" class='mx-auto mt-2' min-width="90%" max-width="90%" elevation="4" color="secondary">
                                <v-card-title class='pb-2'>
                                    {{eventLabels[event.name]}}
                                    <v-chip v-if="event.enabled" color="success" x-small label class='ml-2 px-2'>Enabled</v-chip>
                                    <v-chip v-else color="error" x-small label class='ml-2 px-2'>Disabled</v-chip>
                                </v-card-title>
                                <v-card-text class='pb-0 pt-2'>
                                    <v-row>
                                        <v-col class='pa-0'>
                                            <v-card-subtitle class='py-0 subtitle-2'>Message</v-card-subtitle>
                                            <v-card-text class='text--primary'>"{{event.message}}"</v-card-text>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions class='pt-0'>
                                    <v-btn text @click="modifyEvent(i)" color="primary">Modify</v-btn>
                                    <v-btn text @click="flipEventStatus(event)" color="primary">{{event.enabled ? 'Disable' : 'Enable'}}</v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-divider v-if="i < Object.keys(channelData).length - 1" :key="i" class='mx-4'/>
                        </template>
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
            newEventData: {},
            modifyDialog: false,
            modifyValid: true,
            toModify: null,
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
            this.axios.put(`/events/${channel}/${event.name}`, {message: event.message, enabled: !event.enabled}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                event.enabled = !event.enabled;
            }).catch(() => {
                this.isSending = false;
                event.enabled = !event.enabled;
            });
        },
        modifyEvent: function(index) {
            this.modifyDialog = true;
            this.newEventData = {...this.channelData[index]};
            this.toModify = index;
        },
        updateData: function() {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            this.axios.put(`/events/${channel}/${this.newEventData.name}`, {message: this.newEventData.message, enabled: this.newEventData.enabled}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.modifyDialog = false;
                this.channelData[this.toModify] = {...this.newEventData};
                this.newEventData = {};
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        },
        cancelModify: function() {
            this.modifyDialog = false;
            this.newEventData = {};
        },
        insertDataTag: function(tag) {
            const el = this.$refs['modify-textarea'].$el.querySelector('textarea');

            let cursorPos = el.selectionEnd;
            this.newEventData.message = `${this.newEventData.message.substring(0, cursorPos)}${tag.tag}${this.newEventData.message.substring(cursorPos)}`;

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