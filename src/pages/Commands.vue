<template>
    <div id='commands'>
        <v-container>
            <v-row>
                <v-col class='mx-3'>
                    <h1 class='display-2 font-weight-light'>Channel Commands</h1>
                    <h2 class='subtitle-1 font-weight-light mx-2'>Configure MtheBot_'s commands for your channel.</h2>
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
                <v-col>
                    <v-sheet tile elevation="4" class='mx-4'>
                        <v-toolbar flat dense>
                            <v-toolbar-title class='ml-n4 align-self-end'>
                                <v-tabs v-model="tab">
                                    <v-tab>Custom</v-tab>
                                    <v-tab>Default</v-tab>
                                </v-tabs>
                            </v-toolbar-title>
                            <v-spacer/>
                            <v-dialog v-model="newDialog" attach="#commands" persistent max-width="50rem">
                                <template v-slot:activator="{ on: dialog }">
                                    <v-tooltip left>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-fab-transition>
                                                <v-btn color="primary" v-show="tab == 0" v-on="{...dialog, ...tooltip}" @click="createNewCommand" depressed fab x-small class='ml-auto'>
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                            </v-fab-transition>
                                        </template>
                                        <span>Add a new command</span>
                                    </v-tooltip>
                                </template>
                                <v-card>
                                    <v-card-title>New Command</v-card-title>
                                    <v-card-subtitle>Create a new command for your chat</v-card-subtitle>
                                    <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                                    <v-form ref="newForm" v-model="newFormValid">
                                        <v-card-text class='mb-n4'>
                                            <v-text-field 
                                                v-model="newCommandData.alias"
                                                label="Alias"
                                                hide-details="auto"
                                                maxlength="15"
                                                :rules="[
                                                    validationRules.required,
                                                    validationRules.noSpaces,
                                                    validationRules.nameExists(channelData.map(c => c.alias), true)
                                                ]"
                                                outlined dense counter required
                                                class='flex-grow-0'/>
                                        </v-card-text>
                                        <v-card-text class='mb-n4'>
                                            <v-textarea
                                                    v-model="newCommandData.message"
                                                    label="Message"
                                                    hide-details="auto"
                                                    maxlength="500"
                                                    :rules="[validationRules.required]"
                                                    outlined dense counter auto-grow required/>
                                        </v-card-text>
                                        <v-card-text>
                                            <v-text-field
                                                type="number"
                                                v-model="newCommandData.cooldown"
                                                label="Cooldown Time"
                                                suffix="seconds"
                                                hide-details="auto"
                                                min="0"
                                                :rules="[validationRules.required]"
                                                outlined dense required/>
                                        </v-card-text>
                                        <v-card-text>
                                            <v-select
                                                    v-model="newCommandData.user_level"
                                                    :items="userLevels"
                                                    label="User Level"
                                                    hide-details="auto"
                                                    outlined dense/>
                                        </v-card-text>
                                    </v-form>
                                    <v-card-actions>
                                        <v-spacer/>
                                        <v-btn color="primary" text @click="newDialog = false; cancelNew()">Cancel</v-btn>
                                        <v-btn color="primary" text @click="if (newFormValid) {addNew();}">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                                <v-overlay :value="isSending" opacity=".15" absolute>
                                    <v-progress-circular indeterminate color="primary" size="64"/>
                                </v-overlay>
                            </v-dialog>
                        </v-toolbar>
                        <v-divider/>
                        <v-tabs-items v-model="tab">
                            <v-tab-item>
                                <v-list>
                                    <v-list-item v-if="channelData.length === 0">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Looks like you have no commands!  Hit the '+' button to make one.
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <template v-for="(command, i) in channelData">
                                        <v-list-item :key="'command' + i">
                                            <v-list-item-content>
                                                <v-list-item-title class='font-weight-medium'>
                                                    !{{command.alias}}
                                                </v-list-item-title>
                                                <v-row class='mb-n4 mt-n2'>
                                                    <v-col style="word-break: break-word">
                                                        <v-list-item-subtitle>Message</v-list-item-subtitle>
                                                        "{{command.message}}"
                                                    </v-col>
                                                    <v-col class='flex-grow-0 text-no-wrap'>
                                                        <v-list-item-subtitle>Cooldown</v-list-item-subtitle>
                                                        {{command.cooldown}} seconds
                                                    </v-col>
                                                    <v-col class='flex-grow-0'>
                                                        <v-list-item-subtitle>User Level</v-list-item-subtitle>
                                                        {{userLevels.find(ul => ul.value === command.user_level).text}}+
                                                    </v-col>
                                                    <v-col class='flex-grow-0'>
                                                        <v-menu offset-y left>
                                                            <template v-slot:activator="{on}">
                                                                <v-btn icon v-on="on" :ripple=false>
                                                                    <v-icon>mdi-dots-vertical</v-icon>
                                                                </v-btn>
                                                            </template>

                                                            <v-list dense>
                                                                <v-list-item @click="cacheCurrentData(command); $set(modifyDialog, i, true);">
                                                                    <v-list-item-content>
                                                                        <v-list-item-title>Modify</v-list-item-title>
                                                                    </v-list-item-content>
                                                                </v-list-item>
                                                                <v-list-item @click="cacheCurrentData(command); $set(removeDialog, i, true);" color="error">
                                                                    <v-list-item-content>
                                                                        <v-list-item-title style="color: #FF5252">Remove</v-list-item-title>
                                                                    </v-list-item-content>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                        <v-dialog v-model="modifyDialog[i]" attach="#commands" persistent max-width="50rem">
                                                            <v-card>
                                                                <v-card-title>Modify !{{command.alias}}</v-card-title>
                                                                <v-card-subtitle>Update the properties of the !{{command.alias}} command.</v-card-subtitle>
                                                                <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                                                                <v-form v-model="modifyFormValid[i]">
                                                                    <v-card-text class='mb-n4'>
                                                                        <v-text-field 
                                                                            v-model="command.alias"
                                                                            label="Command Alias"
                                                                            hide-details="auto"
                                                                            maxlength="15"
                                                                            :rules="[
                                                                                validationRules.required,
                                                                                validationRules.noSpaces,
                                                                                validationRules.nameExists(channelData.map(c => c.alias), false)
                                                                            ]"
                                                                            outlined dense counter required/>
                                                                    </v-card-text>
                                                                    <v-card-text class='mb-n4'>
                                                                        <v-textarea
                                                                            v-model="command.message"
                                                                            label="Message"
                                                                            hide-details="auto"
                                                                            maxlength="500"
                                                                            :rules="[validationRules.required]"
                                                                            outlined dense counter auto-grow required/>
                                                                    </v-card-text>
                                                                    <v-card-text>
                                                                        <v-text-field
                                                                            type="number"
                                                                            v-model="command.cooldown"
                                                                            label="Cooldown Time"
                                                                            suffix="seconds"
                                                                            hide-details="auto"
                                                                            min="0"
                                                                            :rules="[validationRules.required]"
                                                                            outlined dense required/>
                                                                    </v-card-text>
                                                                    <v-card-text>
                                                                        <v-select
                                                                            v-model="command.user_level"
                                                                            :items="userLevels"
                                                                            label="User Level"
                                                                            hide-details="auto"
                                                                            outlined dense/>
                                                                    </v-card-text>
                                                                </v-form>
                                                                <v-card-actions>
                                                                    <v-dialog v-model="removeDialog[i]" attach="#commands" persistent max-width="20rem">
                                                                        <template v-slot:activator="{ on }">
                                                                            <v-btn color="error" v-on="on" text>Remove</v-btn>
                                                                        </template>
                                                                        <v-card>
                                                                            <v-card-title>Remove Command</v-card-title>
                                                                            <v-card-text>Are you sure you would like to remove the <strong>!{{command.alias}}</strong> command?</v-card-text>
                                                                            <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                                                                            <v-card-actions>
                                                                                <v-spacer/>
                                                                                <v-btn color="primary" text @click="$set(removeDialog, i, false)">Cancel</v-btn>
                                                                                <v-btn color="error" text @click="removeCommand(i)">Remove</v-btn>
                                                                            </v-card-actions>
                                                                        </v-card>
                                                                    </v-dialog>
                                                                    <v-spacer/>
                                                                    <v-btn color="primary" text @click="$set(modifyDialog, i, false); cancelModify(i)">Cancel</v-btn>
                                                                    <v-btn color="primary" text @click="if (modifyFormValid[i]) {updateData(i, command)}">Save</v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                            <v-overlay :value="isSending" opacity=".15" absolute>
                                                                <v-progress-circular indeterminate color="primary" size="64"/>
                                                            </v-overlay>
                                                        </v-dialog>
                                                        <v-dialog v-model="removeDialog[i]" attach="#commands" persistent max-width="20rem">
                                                            <v-card>
                                                                <v-card-title>Remove Command</v-card-title>
                                                                <v-card-text>Are you sure you would like to remove the <strong>!{{command.alias}}</strong> command?</v-card-text>
                                                                <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                                                                <v-card-actions>
                                                                    <v-spacer/>
                                                                    <v-btn color="primary" text @click="$set(removeDialog, i, false)">Cancel</v-btn>
                                                                    <v-btn color="error" text @click="removeCommand(i)">Remove</v-btn>
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
                            </v-tab-item>
                            <v-tab-item>
                                <div class='pa-4'>
                                    <h3 class='display-1 font-weight-light'>Default commands are currently in development</h3>
                                    <h4 class='subtitle-1 font-weight-light'>Stay tuned to start using handy built-in commands for MtheBot_ in your channel!</h4>
                                </div>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import validationRules from '../defaults/validationRules';

export default {
    name: 'Commands',
    data: function() {
        return {
            userLevels: [
                {text: "User", value: 0},
                {text: "VIP", value: 1},
                {text: "Subscriber", value: 2},
                {text: "Moderator", value: 3},
            ],
            validationRules: validationRules,
            channelExists: false,
            channelData: [],
            dataCache: [],
            newCommandData: {},
            modifyDialog: {},
            modifyFormValid: {},
            newDialog: false,
            newFormValid: true,
            removeDialog: {},
            tab: null,
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
        cacheCurrentData: function(command) {
            this.responseError = null;
            this.dataCache = JSON.parse(JSON.stringify(command));
        },
        updateData: function(dialogIndex, commandData) {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            this.axios.put(`/commands/${channel}/${this.dataCache.alias}`, commandData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.modifyDialog[dialogIndex] = false;
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        },
        cancelModify: function(index) {
            let undo = this.channelData[index];
            undo.alias = this.dataCache.alias;
            undo.cooldown = this.dataCache.cooldown;
            undo.message = this.dataCache.message;
            undo.user_level = this.dataCache.user_level;
        },
        createNewCommand: function() {
            this.responseError = null;
            this.newCommandData = {
                alias: '',
                message: '',
                cooldown: 5,
                user_level: 0,
            }
            this.$refs.newForm.resetValidation();
        },
        cancelNew: function() {
            this.newCommandData = {};
        },
        addNew: function() {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            this.axios.post(`/commands/${channel}`, this.newCommandData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.newDialog = false;
                this.channelData.push(this.newCommandData);
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        },
        removeCommand: function(index) {
            const channel = this.$store.state.userData.id;
            let removed = this.channelData.splice(index, 1);
            this.isSending = true;
            this.axios.delete(`/commands/${channel}/${removed[0].alias}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
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
            this.axios.get(`/commands/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
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