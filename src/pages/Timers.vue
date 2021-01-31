<template>
    <div id='timers'>
        <v-dialog v-model="modifyDialog" attach="#timers" persistent max-width="50rem">
            <v-card>
                <v-card-title v-if="toModify < 0">New Timer</v-card-title>
                <v-card-title v-else>Modify {{channelData[toModify].name}}</v-card-title>

                <v-card-subtitle v-if="toModify < 0">Create a new timer for your chat</v-card-subtitle>
                <v-card-subtitle v-else>Update the properties of the {{channelData[toModify].name}} timer.</v-card-subtitle>

                <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>

                <v-form ref="formDialog" v-model="modifyFormValid">
                    <v-card-text class='mb-n4'>
                        <v-text-field 
                            v-model="newTimerData.name"
                            label="Name"
                            hide-details="auto"
                            maxlength="15"
                            :rules="[
                                validationRules.required,
                                validationRules.noSpaces,
                                validationRules.nameExists(toModify < 0 ? channelData.map(e => e.name) : channelData.filter(e => e.name !== channelData[toModify].name).map(e => e.name))
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
                            v-model.number="newTimerData.interval"
                            label="Message Interval"
                            suffix="seconds"
                            hide-details="auto"
                            min="0"
                            :rules="[validationRules.required, validationRules.aboveZero]"
                            outlined dense required/>
                    </v-card-text>
                    <v-card-text>
                        <v-text-field
                            type="number"
                            v-model.number="newTimerData.message_threshold"
                            label="Message Threshold"
                            hint="The number of chats required before being able to send the timed message"
                            suffix="messages"
                            hide-details="auto"
                            min="0"
                            :rules="[validationRules.required, validationRules.aboveZero]"
                            outlined dense required/>
                    </v-card-text>
                </v-form>
                <v-card-actions>
                    <v-btn v-if="toModify >= 0" color="error" text @click="openRemoveDialog(toModify)">Remove</v-btn>
                    <v-spacer/>
                    <v-btn color="primary" text @click="cancelModify">Cancel</v-btn>
                    <v-btn color="primary" text @click="{if (modifyFormValid){submitModify()}}">Save</v-btn>
                </v-card-actions>
            </v-card>
            <v-overlay :value="isSending" opacity=".15" absolute>
                <v-progress-circular indeterminate color="primary" size="64"/>
            </v-overlay>
        </v-dialog>
        <v-dialog v-model="removeDialog" attach="#timers" persistent max-width="20rem">
            <v-card>
                <v-card-title>Remove Timer</v-card-title>
                <v-card-text>Are you sure you would like to remove the <strong v-if="toRemove > -1">{{channelData[toRemove].name}}</strong> timer?</v-card-text>
                <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" text @click="cancelRemove">Cancel</v-btn>
                    <v-btn color="error" text @click="removeTimer">Remove</v-btn>
                </v-card-actions>
            </v-card>
            <v-overlay :value="isSending" opacity=".15" absolute>
                <v-progress-circular indeterminate color="primary" size="64"/>
            </v-overlay>
        </v-dialog>
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
            <v-row v-else class='mx-2'>
                <v-sheet tile elevation="0" class='mx-auto flex-grow-1' style='background-color: rgba(0, 0, 0, 0); max-width: 1000px'>
                    <v-toolbar flat dense>
                        <v-spacer/>
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" v-on="on" @click="modifyTimer(-1)" depressed fab x-small class='ml-auto'>
                                    <v-icon color="accent">mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <span>Add a new timer</span>
                        </v-tooltip>
                    </v-toolbar>
                    <v-divider/>
                    <v-row class='mx-auto' style='max-width: 1000px'>
                        <v-list-item v-if="channelData.length === 0">
                            <v-list-item-content>
                                <v-list-item-title>
                                    Looks like you have no timers!  Hit the '+' button to make one.
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <template v-for="(timer, i) in channelData">
                            <v-card :key="'timer' + i" class='mx-auto mt-2' min-width="90%" max-width="90%" elevation="4">
                                <v-card-title>
                                    {{timer.name}}
                                    <v-chip v-if="timer.enabled" color="success" x-small label class='ml-2 px-2'>Enabled</v-chip>
                                    <v-chip v-else color="error" x-small label class='ml-2 px-2'>Disabled</v-chip>
                                </v-card-title>
                                <v-card-text class='py-0'>
                                    <v-row>
                                        <v-col class='pa-0 flex-grow-0 text-no-wrap'>
                                            <v-card-subtitle class='py-0 subtitle-2'>Interval</v-card-subtitle>
                                            <v-card-text class='text--primary pb-2'>{{timer.interval}} seconds</v-card-text>
                                        </v-col>
                                        <v-col class='pa-0 flex-grow-0 text-no-wrap'>
                                            <v-card-subtitle class='py-0 subtitle-2'>Threshold</v-card-subtitle>
                                            <v-card-text class='text--primary pb-2'>{{timer.message_threshold}} messages</v-card-text>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-divider class='mx-4'/>
                                <v-card-text class='pb-0 pt-2'>
                                    <v-row>
                                        <v-col class='pa-0'>
                                            <v-card-subtitle class='py-0 subtitle-2'>Message</v-card-subtitle>
                                            <v-card-text class='text--primary'>"{{timer.message}}"</v-card-text>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions class='pt-0'>
                                    <v-btn text @click="modifyTimer(i)" color="primary">Modify</v-btn>
                                    <v-btn text @click="flipTimerStatus(timer)" color="primary">{{timer.enabled ? 'Disable' : 'Enable'}}</v-btn>
                                    <v-btn icon @click="openRemoveDialog(i)" color="error">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-row>
                </v-sheet>
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
            channelData: [],
            newTimerData: {},
            modifyDialog: false,
            toModify: -1,
            modifyFormValid: false,
            removeDialog: false,
            toRemove: -1,
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
        flipTimerStatus: function(timer) {
            const channel = this.$store.state.userData.id;
            let newData = {...timer};
            newData.enabled = !timer.enabled;
            this.axios.put(`/timers/${channel}/${timer.name}`, newData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                timer.enabled = !timer.enabled;
            }).catch(() => {
                this.isSending = false;
                timer.enabled = !timer.enabled;
            });
        },
        modifyTimer: function(index) {
            this.responseError = null;
            this.toModify = index;
            this.newTimerData = index >= 0 ? {
                name: this.channelData[index].name,
                enabled: this.channelData[index].enabled,
                message: this.channelData[index].message,
                interval: this.channelData[index].interval,
                message_threshold: this.channelData[index].message_threshold,
            } : {
                name: '',
                enabled: true,
                message: '',
                interval: 300,
                message_threshold: 5,
            }
            this.modifyDialog = true;
            this.$refs.formDialog && this.$refs.formDialog.resetValidation();
        },
        cancelModify: function() {
            this.responseError = null;
            this.modifyDialog = false;
            this.newTimerData = {};
            this.toModify = -1;
        },
        submitModify: function() {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            if (this.toModify < 0) {
                this.axios.post(`/timers/${channel}`, this.newTimerData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                    this.isSending = false;
                    this.modifyDialog = false;
                    this.channelData.push(this.newTimerData);
                }).catch(err => {
                    this.isSending = false;
                    this.responseError = err.response.data;
                });
            } else {
                this.axios.put(`/timers/${channel}/${this.channelData[this.toModify].name}`, this.newTimerData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                    this.isSending = false;
                    this.modifyDialog = false;
                    this.channelData[this.toModify] = this.newTimerData;
                }).catch(err => {
                    this.isSending = false;
                    this.responseError = err.response.data;
                });
            }
        },
        openRemoveDialog: function(index) {
            this.toRemove = index;
            this.removeDialog = true;
        },
        cancelRemove: function() {
            this.toRemove = -1;
            this.removeDialog = false;
        },
        removeTimer: function() {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            this.axios.delete(`/timers/${channel}/${this.channelData[this.toRemove].name}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.removeDialog = false;
                this.modifyDialog = false;
                this.channelData.splice(this.toRemove, 1);
                this.toModify = -1;
                this.toRemove = -1;
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        }
    },
    mounted() {
        const channel = this.$store.state.userData.id;
        this.axios.get(`/timers/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
            this.channelData = res.data;
            this.loadingData = false;
        }).catch(err => {
            this.loadingData = false;
            console.log(`ERROR: ${err}`);
        });
    },
}
</script>