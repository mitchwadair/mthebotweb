<template>
    <div id='timers'>
        <v-container>
            <v-row>
                <v-col class='mx-3'>
                    <h1 class='display-2 font-weight-light'>Channel Timers</h1>
                    <h2 class='subtitle-1 font-weight-light mx-2'>Configure the timed messages sent to your chat by MtheBot_!</h2>
                </v-col>
            </v-row>
            <v-row v-if="loadingData">
                <v-col align="center">
                    <v-progress-circular indeterminate color="primary" size="100" width="8"/>
                </v-col>
            </v-row>
            <v-row v-else-if="!channelExists">
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
                <v-col class='px-0 px-md-3'>
                    <v-sheet tile elevation="4" class='mx-4'>
                        <v-list class='pt-0'>
                            <v-list-item key="actions">
                                <v-list-item-content class='py-0'>
                                    <v-row>
                                        <v-col class='d-flex py-0'>
                                            <v-dialog v-model="newDialog" attach="#timers" persistent max-width="50rem">
                                                <template v-slot:activator="{ on: dialog }">
                                                    <v-tooltip left>
                                                        <template v-slot:activator="{ on: tooltip }">
                                                            <v-btn color="primary" v-on="{...dialog, ...tooltip}" @click="createNewTimer" depressed fab x-small class='ml-auto'>
                                                                <v-icon color="accent">mdi-plus</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <span>Add a new timer</span>
                                                    </v-tooltip>
                                                </template>
                                                <v-card>
                                                    <v-card-title>New Timer</v-card-title>
                                                    <v-card-subtitle>Create a new timer for your chat</v-card-subtitle>
                                                    <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                                                    <v-form ref="newForm" v-model="newFormValid">
                                                        <v-card-text class='mb-n4'>
                                                            <v-text-field 
                                                                v-model="newTimerData.name"
                                                                label="Name"
                                                                hide-details="auto"
                                                                maxlength="15"
                                                                :rules="[
                                                                    validationRules.required,
                                                                    validationRules.noSpaces,
                                                                    validationRules.nameExists(channelData.map(t => t.name), true)
                                                                ]"
                                                                outlined dense counter required
                                                                class='flex-grow-0'/>
                                                        </v-card-text>
                                                        <v-card-text class='mb-n4'>
                                                            <v-textarea
                                                                    v-model="newTimerData.message"
                                                                    label="Message"
                                                                    hide-details="auto"
                                                                    maxlength="500"
                                                                    :rules="[validationRules.required]"
                                                                    outlined dense counter auto-grow required/>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            <v-text-field
                                                                type="number"
                                                                v-model="newTimerData.interval"
                                                                label="Message Interval"
                                                                suffix="seconds"
                                                                hide-details="auto"
                                                                min="0"
                                                                :rules="[validationRules.required]"
                                                                outlined dense required/>
                                                        </v-card-text>
                                                        <v-card-text>
                                                            <v-text-field
                                                                type="number"
                                                                v-model="newTimerData.message_threshold"
                                                                label="Message Threshold"
                                                                hint="The number of chats required before being able to send the timed message"
                                                                suffix="messages"
                                                                hide-details="auto"
                                                                min="0"
                                                                :rules="[validationRules.required]"
                                                                outlined dense required/>
                                                        </v-card-text>
                                                    </v-form>
                                                    <v-card-actions>
                                                        <v-spacer/>
                                                        <v-btn color="primary" text @click="newDialog = false; cancelNew()">Cancel</v-btn>
                                                        <v-btn color="primary" text @click="if (newFormValid) {addNew()}">Save</v-btn>
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
                            <v-divider/>
                            <v-list-item v-if="channelData.length === 0">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Looks like you have no timers!  Hit the '+' button to make one.
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <template v-for="(timer, i) in channelData">
                                 <v-list-item :key="'timer' + i">
                                     <v-list-item-content>
                                         <v-list-item-title class='font-weight-medium'>
                                            {{timer.name}}
                                            <v-chip v-if="timer.enabled" color="success" x-small label class='ml-2 px-2'>Enabled</v-chip>
                                            <v-chip v-else color="error" x-small label class='ml-2 px-2'>Disabled</v-chip>
                                        </v-list-item-title>
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
                                                <v-list-item-subtitle>Threshold</v-list-item-subtitle>
                                                {{timer.message_threshold}}
                                            </v-col>
                                            <v-col class='flex-grow-0'>
                                                <v-menu offset-y left>
                                                    <template v-slot:activator="{on}">
                                                        <v-btn icon v-on="on" :ripple=false>
                                                            <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <v-list dense>
                                                        <v-list-item @click="flipTimerStatus(timer)">
                                                            <v-list-item-content>
                                                                <v-list-item-title>{{timer.enabled ? 'Disable' : 'Enable'}}</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                        <v-list-item @click="cacheCurrentData(timer); $set(modifyDialog, i, true);">
                                                            <v-list-item-content>
                                                                <v-list-item-title>Modify</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                        <v-list-item @click="cacheCurrentData(timer); $set(removeDialog, i, true);">
                                                            <v-list-item-content>
                                                                <v-list-item-title style="color: #FF5252">Remove</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                                <v-dialog v-model="modifyDialog[i]" attach="#timers" persistent max-width="50rem">
                                                    <v-card>
                                                        <v-card-title>Modify {{timer.name}}</v-card-title>
                                                        <v-card-subtitle>Update the properties of the {{timer.name}} timer.</v-card-subtitle>
                                                        <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                                                        <v-form v-model="modifyFormValid[i]">
                                                            <v-card-text class='mb-n4'>
                                                                <v-text-field 
                                                                    v-model="timer.name"
                                                                    label="Name"
                                                                    hide-details="auto"
                                                                    maxlength="15"
                                                                    :rules="[
                                                                        validationRules.required,
                                                                        validationRules.noSpaces,
                                                                        validationRules.nameExists(channelData.map(t => t.name), false)
                                                                    ]"
                                                                    outlined dense counter required/>
                                                            </v-card-text>
                                                            <v-card-text class='mb-n4'>
                                                                <v-textarea
                                                                    v-model="timer.message"
                                                                    label="Message"
                                                                    hide-details="auto"
                                                                    maxlength="500"
                                                                    :rules="[validationRules.required]"
                                                                    outlined dense counter auto-grow required/>
                                                            </v-card-text>
                                                            <v-card-text>
                                                                <v-text-field
                                                                    type="number"
                                                                    v-model="timer.interval"
                                                                    label="Message Interval"
                                                                    suffix="seconds"
                                                                    hide-details="auto"
                                                                    min="0"
                                                                    :rules="[validationRules.required]"
                                                                    outlined dense required/>
                                                            </v-card-text>
                                                            <v-card-text>
                                                                <v-text-field
                                                                    type="number"
                                                                    v-model="timer.message_threshold"
                                                                    label="Message Threshold"
                                                                    hint="The number of chats required before being able to send the timed message"
                                                                    suffix="messages"
                                                                    hide-details="auto"
                                                                    min="0"
                                                                    :rules="[validationRules.required]"
                                                                    outlined dense required/>
                                                            </v-card-text>
                                                        </v-form>
                                                        <v-card-actions>
                                                            <v-btn color="error" text @click="$set(removeDialog, i, true)">Remove</v-btn>
                                                            <v-spacer/>
                                                            <v-btn color="primary" text @click="$set(modifyDialog, i, false); cancelModify(i)">Cancel</v-btn>
                                                            <v-btn color="primary" text @click="if (modifyFormValid[i]) {updateData(i, timer)}">Save</v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                    <v-overlay :value="isSending" opacity=".15" absolute>
                                                        <v-progress-circular indeterminate color="primary" size="64"/>
                                                    </v-overlay>
                                                </v-dialog>
                                                <v-dialog v-model="removeDialog[i]" attach="#timers" persistent max-width="20rem">
                                                    <v-card>
                                                        <v-card-title>Remove Message</v-card-title>
                                                        <v-card-text>Are you sure you would like to remove the <strong>{{timer.name}}</strong> timed message?</v-card-text>
                                                        <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                                                        <v-card-actions>
                                                            <v-spacer/>
                                                            <v-btn color="primary" text @click="$set(removeDialog, i, false)">Cancel</v-btn>
                                                            <v-btn color="error" text @click="removeTimer(i)">Remove</v-btn>
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
                                 <v-divider v-if="i < channelData.length - 1" :key="i" class='mx-4'/>
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
    name: "Timers",
    data: function() {
        return {
            validationRules: validationRules,
            channelExists: false,
            channelData: [],
            dataCache: [],
            newTimerData: {},
            modifyDialog: {},
            modifyFormValid: {},
            newDialog: false,
            newFormValid: true,
            removeDialog: {},
            loadingData: true,
            isSending: false,
            responseError: null,
        };
    },
    methods: {
        enableBot: function() {
            const channel = this.$store.state.userData.id;
            this.axios.post(`/init/${channel}`, {}, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.$router.go();
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        flipTimerStatus: function(timer) {
            const channel = this.$store.state.userData.id;
            timer.enabled = !timer.enabled;
            this.axios.put(`/timers/${channel}/${timer.name}`, timer, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
            }).catch(() => {
                this.isSending = false;
                timer.enabled = !timer.enabled;
            });
        },
        cacheCurrentData: function(timer) {
            this.responseError = null;
            this.dataCache = JSON.parse(JSON.stringify(timer));
        },
        updateData: function(dialogIndex, timerData) {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            this.axios.put(`/timers/${channel}/${this.dataCache.name}`, timerData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.modifyDialog[dialogIndex] = false;
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        },
        cancelModify: function(index) {
            let undo = this.channelData[index];
            undo.name = this.dataCache.name;
            undo.enabled = this.dataCache.enabled;
            undo.message = this.dataCache.message;
            undo.interval = this.dataCache.interval;
            undo.message_threshold = this.dataCache.message_threshold;
        },
        createNewTimer: function() {
            this.responseError = null;
            this.newTimerData = {
                name: '',
                enabled: true,
                message: '',
                interval: 300,
                message_threshold: 5,
            }
            this.$refs.newForm.resetValidation();
        },
        cancelNew: function() {
            this.newTimerData = {};
        },
        addNew: function() {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            this.axios.post(`/timers/${channel}`, this.newTimerData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.newDialog = false;
                this.channelData.push(this.newTimerData);
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        },
        removeTimer: function(index) {
            const channel = this.$store.state.userData.id;
            let removed = this.channelData.splice(index, 1);
            this.isSending = true;
            this.axios.delete(`/timers/${channel}/${removed[0].name}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.removeDialog[index] = false;
                this.modifyDialog[index] = false;
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        }
    },
    mounted() {
        const channel = this.$store.state.userData.id;
        this.axios.get(`/chats/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
            this.axios.get(`/timers/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
                this.channelData = res.data;
                this.channelExists = true;
                this.loadingData = false;
            }).catch(err => {
                this.loadingData = false;
                console.log(`ERROR: ${err}`);
            });
        }).catch(err => {
            this.loadingData = false;
            if (err.response.status === 404) {
                this.channelExists = false;
                return;
            } else if (err.response.status === 401) {
                localStorage.removeItem('uat');
                this.$router.push(`/?error=auth&message=${err.response.data}`);
                this.$router.go();
                return;
            }
            console.log(`ERROR: ${err}`);
        });
    },
}
</script>