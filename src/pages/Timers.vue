<!--
  Copyright (c) 2020 Mitchell Adair

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

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
                <v-col>
                    <v-sheet tile elevation="4" class='mx-4'>
                        <v-list>
                            <v-list-item key="actions">
                                <v-list-item-content>
                                    <v-row>
                                        <v-col class='d-flex py-0'>
                                            <v-dialog v-model="newDialog" attach="#timers" persistent max-width="50rem">
                                                <template v-slot:activator="{ on: dialog }">
                                                    <v-tooltip left>
                                                        <template v-slot:activator="{ on: tooltip }">
                                                            <v-btn color="primary" v-on="{...dialog, ...tooltip}" @click="createNewTimer" depressed fab x-small class='ml-auto'>
                                                                <v-icon>mdi-plus</v-icon>
                                                            </v-btn>
                                                        </template>
                                                        <span>Add a new timer</span>
                                                    </v-tooltip>
                                                </template>
                                                <v-card>
                                                    <v-card-title>New Timer</v-card-title>
                                                    <v-card-subtitle>Create a new timer for your chat</v-card-subtitle>
                                                    <v-card-text class='mb-n4'>
                                                        <v-text-field 
                                                            v-model="newTimerData.name"
                                                            label="Name"
                                                            hide-details="auto"
                                                            maxlength="15"
                                                            outlined dense counter
                                                            class='flex-grow-0'/>
                                                    </v-card-text>
                                                    <v-card-text class='mb-n4'>
                                                        <v-textarea
                                                                v-model="newTimerData.message"
                                                                label="Message"
                                                                hide-details="auto"
                                                                maxlength="500"
                                                                outlined dense counter auto-grow/>
                                                    </v-card-text>
                                                    <v-card-text>
                                                        <v-text-field
                                                            type="number"
                                                            v-model="newTimerData.seconds"
                                                            label="Message Interval"
                                                            suffix="seconds"
                                                            hide-details="auto"
                                                            min="0"
                                                            outlined dense/>
                                                    </v-card-text>
                                                    <v-card-text>
                                                        <v-text-field
                                                            type="number"
                                                            v-model="newTimerData.messageThreshold"
                                                            label="Message Threshold"
                                                            hint="The number of chats required before being able to send the timed message"
                                                            suffix="seconds"
                                                            hide-details="auto"
                                                            min="0"
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
                            <template v-for="(timer, i) in channelData">
                                 <v-list-item :key="'timer' + i">
                                     <v-list-item-content>
                                         <v-list-item-title class='font-weight-medium'>{{timer.name}}</v-list-item-title>
                                         <v-row class='mb-n4 mt-n2'>
                                             <v-col class='flex-grow-0'>
                                                <v-list-item-subtitle>Enabled</v-list-item-subtitle>
                                                <v-checkbox dense hide-details="auto" v-model="timer.enabled" v-on:change="updateData" class="mt-0 pt-0 mb-n2"/>
                                            </v-col>
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
                                                        <v-btn color="primary" v-on="on" @click="cacheCurrentData" depressed>Modify</v-btn>
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
                                                                outlined dense counter/>
                                                        </v-card-text>
                                                        <v-card-text class='mb-n4'>
                                                            <v-textarea
                                                                v-model="timer.message"
                                                                label="Message"
                                                                hide-details="auto"
                                                                maxlength="500"
                                                                outlined dense counter auto-grow/>
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
                                                            <v-dialog v-model="removeDialog[i]" attach="#timers" persistent max-width="20rem">
                                                                <template v-slot:activator="{ on }">
                                                                    <v-btn color="error" v-on="on" text>Remove</v-btn>
                                                                </template>
                                                                <v-card>
                                                                    <v-card-title>Remove Message</v-card-title>
                                                                    <v-card-text>Are you sure you would like to remove the <strong>{{timer.name}}</strong> timed message?</v-card-text>
                                                                    <v-card-actions>
                                                                        <v-spacer/>
                                                                        <v-btn color="primary" text @click="$set(removeDialog, i, false)">Cancel</v-btn>
                                                                        <v-btn color="error" text @click="$set(removeDialog, i, false); $set(modifyDialog, i, false); removeTimer(i)">Remove</v-btn>
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
                                                <v-dialog v-model="removeDialog[i]" attach="#timers" persistent max-width="20rem">
                                                    <template v-slot:activator="{ on: dialog }">
                                                        <v-tooltip top>
                                                            <template v-slot:activator="{ on: tooltip }">
                                                                <v-btn color="error" v-on="{...dialog, ...tooltip}" icon>
                                                                    <v-icon>mdi-delete</v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <span>Remove timer</span>
                                                        </v-tooltip>
                                                    </template>
                                                    <v-card>
                                                        <v-card-title>Remove Message</v-card-title>
                                                        <v-card-text>Are you sure you would like to remove the <strong>{{timer.name}}</strong> timed message?</v-card-text>
                                                        <v-card-actions>
                                                            <v-spacer/>
                                                            <v-btn color="primary" text @click="$set(removeDialog, i, false)">Cancel</v-btn>
                                                            <v-btn color="error" text @click="$set(removeDialog, i, false); removeTimer(i)">Remove</v-btn>
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
            channelData: [],
            dataCache: [],
            newTimerData: {},
            modifyDialog: {},
            newDialog: false,
            removeDialog: {},
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
            this.axios.post(`https://api.bot.mtheb.tv/timers/${channel}`, this.channelData).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        },
        cancelModify: function() {
            this.channelData = JSON.parse(JSON.stringify(this.dataCache));
        },
        createNewTimer: function() {
            this.newTimerData = {
                name: '',
                enabled: true,
                message: '',
                seconds: 300,
                messageThreshold: 5,
            }
        },
        cancelNew: function() {
            this.newTimerData = {}
        },
        addNew: function() {
            this.channelData.push(this.newTimerData);
            this.updateData();
        },
        removeTimer: function(index) {
            this.channelData.splice(index, 1);
            this.updateData();
        }
    },
    mounted() {
        const channel = this.$store.state.userData.login;
        this.axios.get(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
            if (res.status === 404) {
                this.channelExists = false;
                this.loadingData = false;
                return;
            }
            this.axios.get(`https://api.bot.mtheb.tv/timers/${channel}`).then(res => {
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