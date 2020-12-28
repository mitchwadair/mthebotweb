<template>
    <div id='commands'>
        <v-dialog v-model="modifyDialog" attach="#commands" persistent max-width="50rem">
            <v-card>
                <v-card-title v-if="toModify < 0">New Command</v-card-title>
                <v-card-title v-else>Modify !{{channelData[toModify].alias}}</v-card-title>

                <v-card-subtitle v-if="toModify < 0">Create a new command for your chat</v-card-subtitle>
                <v-card-subtitle v-else>Update the properties of the !{{channelData[toModify].alias}} command.</v-card-subtitle>

                <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>

                <v-form ref="formDialog" v-model="modifyFormValid">
                    <v-card-text class='mb-n4'>
                        <v-text-field 
                            v-model="newCommandData.alias"
                            label="Alias"
                            hide-details="auto"
                            maxlength="15"
                            :rules="[
                                validationRules.required,
                                validationRules.noSpaces,
                                validationRules.nameExists(toModify < 0 ? channelData.map(c => c.alias) : channelData.filter(c => c.alias !== channelData[toModify].alias).map(c => c.alias))
                            ]"
                            outlined dense counter required
                            class='flex-grow-0'/>
                    </v-card-text>
                    <v-card-actions class='mb-n4 mr-2'>
                        <v-card-text class='py-0 font-weight-medium' align="right">Data Tags:</v-card-text>
                        <v-menu v-for="key in Object.keys(dataTags)" :key="key" offset-y left open-on-hover>
                            <template v-slot:activator="{on}">
                                <v-btn text outlined class='ml-2' v-on="on" :ripple=false>{{key}}</v-btn>
                            </template>

                            <v-list dense>
                                <v-list-item v-for="tag in dataTags[key]" :key="tag.tag" @click="insertDataTag(tag)">
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
                    </v-card-actions>
                    <v-card-text class='mb-n4'>
                        <v-textarea
                                v-model="newCommandData.message"
                                label="Message"
                                hide-details="auto"
                                maxlength="500"
                                :ref="'textarea-message'"
                                :rules="[validationRules.required]"
                                outlined dense counter auto-grow required/>
                    </v-card-text>
                    <v-card-text>
                        <v-text-field
                            type="number"
                            v-model.number="newCommandData.cooldown"
                            label="Cooldown Time"
                            suffix="seconds"
                            hide-details="auto"
                            min="0"
                            :rules="[validationRules.required, validationRules.aboveZero]"
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
                    <v-btn v-if="toModify >= 0" color="error" text @click="openRemoveDialog(toModify)">Remove</v-btn>
                    <v-spacer/>
                    <v-btn color="primary" text @click="cancelModify">Cancel</v-btn>
                    <v-btn color="primary" text @click="submitModify">Save</v-btn>
                </v-card-actions>
            </v-card>
            <v-overlay :value="isSending" opacity=".15" absolute>
                <v-progress-circular indeterminate color="primary" size="64"/>
            </v-overlay>
        </v-dialog>
        <v-dialog v-model="removeDialog" attach="#commands" persistent max-width="20rem">
            <v-card>
                <v-card-title>Remove Command</v-card-title>
                <v-card-text>Are you sure you would like to remove the <strong v-if="toRemove > -1">!{{channelData[toRemove].alias}}</strong> command?</v-card-text>
                <v-card-text v-if="responseError" style="color: #FF5252">{{responseError}}</v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" text @click="cancelRemove">Cancel</v-btn>
                    <v-btn color="error" text @click="removeCommand">Remove</v-btn>
                </v-card-actions>
            </v-card>
            <v-overlay :value="isSending" opacity=".15" absolute>
                <v-progress-circular indeterminate color="primary" size="64"/>
            </v-overlay>
        </v-dialog>
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
            <v-row v-else>
                <v-col class='px-0 px-md-3'>
                    <v-sheet tile elevation="4" class='mx-4'>
                        <v-toolbar flat dense>
                            <v-toolbar-title class='ml-n4 align-self-end'>
                                <v-tabs v-model="tab">
                                    <v-tab>Custom</v-tab>
                                    <v-tab>Default</v-tab>
                                </v-tabs>
                            </v-toolbar-title>
                            <v-spacer/>
                            <v-tooltip left>
                                <template v-slot:activator="{on}">
                                    <v-fab-transition>
                                        <v-btn color="primary" v-show="tab == 0" v-on="on" @click="modifyCommand(-1)" depressed fab x-small class='ml-auto'>
                                            <v-icon color="accent">mdi-plus</v-icon>
                                        </v-btn>
                                    </v-fab-transition>
                                </template>
                                <span>Add a new command</span>
                            </v-tooltip>
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
                                                                <v-list-item @click="modifyCommand(i)">
                                                                    <v-list-item-content>
                                                                        <v-list-item-title>Modify</v-list-item-title>
                                                                    </v-list-item-content>
                                                                </v-list-item>
                                                                <v-list-item @click="openRemoveDialog(i)" color="error">
                                                                    <v-list-item-content>
                                                                        <v-list-item-title style="color: #FF5252">Remove</v-list-item-title>
                                                                    </v-list-item-content>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
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
import dataTags from '../defaults/apidatatags.json';

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
            dataTags: dataTags,
            validationRules: validationRules,
            channelData: [],
            dataCache: [],
            newCommandData: {},
            modifyDialog: false,
            toModify: -1,
            modifyFormValid: true,
            removeDialog: false,
            toRemove: -1,
            tab: null,
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
        modifyCommand: function(index) {
            this.responseError = null;
            this.toModify = index;
            this.newCommandData = index >= 0 ? {
                alias: this.channelData[index].alias,
                message: this.channelData[index].message,
                cooldown: this.channelData[index].cooldown,
                user_level: this.channelData[index].user_level,
            } : {
                alias: '',
                message: '',
                cooldown: 5,
                user_level: 0,
            }
            this.modifyDialog = true;
            this.$refs.formDialog.resetValidation();
        },
        cancelModify: function() {
            this.responseError = null;
            this.modifyDialog = false;
            this.newCommandData = {};
            this.toModify = -1;
        },
        submitModify: function() {
            const channel = this.$store.state.userData.id;
            this.isSending = true;
            if (this.toModify < 0) {
                this.axios.post(`/commands/${channel}`, this.newCommandData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                    this.isSending = false;
                    this.modifyDialog = false;
                    this.channelData.push(this.newCommandData);
                }).catch(err => {
                    this.isSending = false;
                    this.responseError = err.response.data;
                });
            } else {
                this.axios.put(`/commands/${channel}/${this.channelData[this.toModify].alias}`, this.newCommandData, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                    this.isSending = false;
                    this.modifyDialog = false;
                    this.channelData[this.toModify] = this.newCommandData;
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
        removeCommand: function() {
            const channel = this.$store.state.userData.id;
            let removed = this.channelData.splice(this.toRemove, 1);
            this.isSending = true;
            this.axios.delete(`/commands/${channel}/${removed[0].alias}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(() => {
                this.isSending = false;
                this.removeDialog = false;
                this.modifyDialog = false;
                this.toModify = -1;
                this.toRemove = -1;
            }).catch(err => {
                this.isSending = false;
                this.responseError = err.response.data;
            });
        },
        insertDataTag: function(tag) {
            const el = this.$refs['textarea-message'].$el.querySelector('textarea');

            let cursorPos = el.selectionEnd;
            this.newCommandData.message = `${this.newCommandData.message.substring(0, cursorPos)}${tag.tag}${this.newCommandData.message.substring(cursorPos)}`;

            cursorPos += tag.tag.length;
            this.$nextTick(() => {
                el.focus();
                el.selectionEnd = cursorPos
            });
        }
    },
    mounted() {
        const channel = this.$store.state.userData.id;
        this.axios.get(`/commands/${channel}`, {headers:{'Authorization': `Bearer ${this.$auth.accessToken}`}}).then(res => {
            this.channelData = res.data;
            this.loadingData = false;
        }).catch(err => {
            this.loadingData = false;
            console.log(`ERROR: ${err}`);
        });
    },
}
</script>