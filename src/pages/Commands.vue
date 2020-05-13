<template>
    <div id='commands'>
        <v-container v-if="loadingData" style="height: 100%">
            <v-row style="height: 100%" align="center">
                <v-col align="center">
                    <v-progress-circular indeterminate color="primary" size="100" width="8"/>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-else>
            <v-row>
                <v-col class='mx-3'>
                    <h1 class='display-2 font-weight-light'>Channel Commands</h1>
                    <h2 class='subtitle-1 font-weight-light mx-2'>Configure MtheBot_'s commands for your channel.</h2>
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
                        <v-tabs v-model="tab">
                            <v-tab>Custom</v-tab>
                            <v-tab>Default</v-tab>
                        </v-tabs>
                        <v-divider/>
                        <v-tabs-items v-model="tab">
                            <v-tab-item>
                                <v-list>
                                    <v-list-item key="actions">
                                        <v-list-item-content>
                                            <v-row>
                                                <v-col class='d-flex py-0'>
                                                    <v-dialog v-model="newDialog" attach="#commands" persistent max-width="50rem">
                                                        <template v-slot:activator="{ on: dialog }">
                                                            <v-tooltip left>
                                                                <template v-slot:activator="{ on: tooltip }">
                                                                    <v-btn color="primary" v-on="{...dialog, ...tooltip}" @click="createNewCommand" depressed fab x-small class='ml-auto'>
                                                                        <v-icon>mdi-plus</v-icon>
                                                                    </v-btn>
                                                                </template>
                                                                <span>Add a new command</span>
                                                            </v-tooltip>
                                                        </template>
                                                        <v-card>
                                                            <v-card-title>New Command</v-card-title>
                                                            <v-card-subtitle>Create a new command for your chat</v-card-subtitle>
                                                            <v-card-text class='mb-n4'>
                                                                <v-text-field 
                                                                    v-model="newCommandData.alias"
                                                                    label="Alias"
                                                                    hide-details="auto"
                                                                    maxlength="15"
                                                                    outlined dense counter
                                                                    class='flex-grow-0'/>
                                                            </v-card-text>
                                                            <v-card-text class='mb-n4'>
                                                                <v-textarea
                                                                        v-model="newCommandData.message"
                                                                        label="Message"
                                                                        hide-details="auto"
                                                                        maxlength="500"
                                                                        outlined dense counter auto-grow/>
                                                            </v-card-text>
                                                            <v-card-text>
                                                                <v-text-field
                                                                    type="number"
                                                                    v-model="newCommandData.cooldown"
                                                                    label="Cooldown Time"
                                                                    suffix="seconds"
                                                                    hide-details="auto"
                                                                    min="0"
                                                                    outlined dense/>
                                                            </v-card-text>
                                                            <v-card-text>
                                                                <v-select
                                                                        v-model="newCommandData.userLevel"
                                                                        :items="userLevels"
                                                                        label="User Level"
                                                                        hide-details="auto"
                                                                        outlined dense/>
                                                            </v-card-text>
                                                            <v-card-actions>
                                                                <v-spacer/>
                                                                <v-btn color="primary" text @click="newDialog = false; cancelNew()">Cancel</v-btn>
                                                                <v-btn color="primary" text @click="newDialog = false; addNew()">Save</v-btn>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-dialog>
                                                </v-col>
                                            </v-row>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider/>
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
                                                        {{userLevels.find(ul => ul.value === command.userLevel).text}}+
                                                    </v-col>
                                                    <v-col class='flex-grow-0'>
                                                        <v-dialog v-model="modifyDialog[i]" attach="#commands" persistent max-width="50rem">
                                                            <template v-slot:activator="{ on }">
                                                                <v-btn color="primary" v-on="on" @click="cacheCurrentData" depressed>Modify</v-btn>
                                                            </template>
                                                            <v-card>
                                                                <v-card-title>Modify !{{command.alias}}</v-card-title>
                                                                <v-card-subtitle>Update the properties of the !{{command.alias}} command.</v-card-subtitle>
                                                                <v-card-text class='mb-n4'>
                                                                    <v-text-field 
                                                                        v-model="command.alias"
                                                                        label="Command Alias"
                                                                        hide-details="auto"
                                                                        maxlength="15"
                                                                        outlined dense counter/>
                                                                </v-card-text>
                                                                <v-card-text class='mb-n4'>
                                                                    <v-textarea
                                                                        v-model="command.message"
                                                                        label="Message"
                                                                        hide-details="auto"
                                                                        maxlength="500"
                                                                        outlined dense counter auto-grow/>
                                                                </v-card-text>
                                                                <v-card-text>
                                                                    <v-text-field
                                                                        type="number"
                                                                        v-model="command.cooldown"
                                                                        label="Cooldown Time"
                                                                        suffix="seconds"
                                                                        hide-details="auto"
                                                                        min="0"
                                                                        outlined dense/>
                                                                </v-card-text>
                                                                <v-card-text>
                                                                    <v-select
                                                                        v-model="command.userLevel"
                                                                        :items="userLevels"
                                                                        label="User Level"
                                                                        hide-details="auto"
                                                                        outlined dense/>
                                                                </v-card-text>
                                                                <v-card-actions>
                                                                    <v-dialog v-model="removeDialog[i]" attach="#commands" persistent max-width="20rem">
                                                                        <template v-slot:activator="{ on }">
                                                                            <v-btn color="error" v-on="on" text>Remove</v-btn>
                                                                        </template>
                                                                        <v-card>
                                                                            <v-card-title>Remove Command</v-card-title>
                                                                            <v-card-text>Are you sure you would like to remove the <strong>!{{command.alias}}</strong> command?</v-card-text>
                                                                            <v-card-actions>
                                                                                <v-spacer/>
                                                                                <v-btn color="primary" text @click="$set(removeDialog, i, false)">Cancel</v-btn>
                                                                                <v-btn color="error" text @click="$set(removeDialog, i, false); removeCommand(i)">Remove</v-btn>
                                                                            </v-card-actions>
                                                                        </v-card>
                                                                    </v-dialog>
                                                                    <v-spacer/>
                                                                    <v-btn color="primary" text @click="$set(modifyDialog, i, false); cancelModify()">Cancel</v-btn>
                                                                    <v-btn color="primary" text @click="$set(modifyDialog, i, false); updateData()">Save</v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-dialog>
                                                    </v-col>
                                                    <v-col class='flex-grow-0'>
                                                        <v-dialog v-model="removeDialog[i]" attach="#commands" persistent max-width="20rem">
                                                            <template v-slot:activator="{ on: dialog }">
                                                                <v-tooltip top>
                                                                    <template v-slot:activator="{ on: tooltip }">
                                                                        <v-btn color="error" v-on="{...dialog, ...tooltip}" icon>
                                                                            <v-icon>mdi-delete</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    <span>Remove command</span>
                                                                </v-tooltip>
                                                            </template>
                                                            <v-card>
                                                                <v-card-title>Remove Command</v-card-title>
                                                                <v-card-text>Are you sure you would like to remove the <strong>!{{command.alias}}</strong> command?</v-card-text>
                                                                <v-card-actions>
                                                                    <v-spacer/>
                                                                    <v-btn color="primary" text @click="$set(removeDialog, i, false)">Cancel</v-btn>
                                                                    <v-btn color="error" text @click="$set(removeDialog, i, false); removeCommand(i)">Remove</v-btn>
                                                                </v-card-actions>
                                                            </v-card>
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
            channelExists: false,
            channelData: [],
            dataCache: [],
            newCommandData: {},
            modifyDialog: {},
            newDialog: false,
            removeDialog: {},
            tab: null,
            loadingData: true,
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
            this.axios.post(`https://api.bot.mtheb.tv/commands/${channel}`, this.channelData).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        cancelModify: function() {
            this.channelData = JSON.parse(JSON.stringify(this.dataCache));
        },
        createNewCommand: function() {
            this.newCommandData = {
                alias: '',
                message: '',
                cooldown: 5,
                userLevel: 0,
            }
        },
        cancelNew: function() {
            this.newCommandData = {}
        },
        addNew: function() {
            this.channelData.push(this.newCommandData);
            this.updateData();
        },
        removeCommand: function(index) {
            this.channelData.splice(index, 1);
            this.updateData();
        }
    },
    mounted() {
        const channel = this.$store.state.userData.login;
        this.axios.get(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
            if (res.status === 404) {
                this.loadingData = false;
                this.channelExists = false;
                return;
            }
            this.axios.get(`https://api.bot.mtheb.tv/commands/${channel}`).then(res => {
                this.channelData = res.data;
                this.channelExists = true;
                this.loadingData = false;
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        });
    },
}
</script>