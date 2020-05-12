<template>
    <div id='commands'>
        <v-container>
            <v-row>
                <v-col class='mx-6'>
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
                        <v-tabs-items v-model="tab">
                            <v-tab-item>
                                <v-list>
                                    <template v-for="(command, i) in channelData">
                                        <v-list-item :key="command.alias">
                                            <v-list-item-content>
                                                <v-list-item-title class='font-weight-medium'>
                                                    !{{command.alias}}
                                                </v-list-item-title>
                                                <v-row class='mb-n4 mt-n2'>
                                                    <v-col>
                                                        <v-list-item-subtitle>Message</v-list-item-subtitle>
                                                        "{{command.message}}"
                                                    </v-col>
                                                    <v-col class='flex-grow-0 text-no-wrap'>
                                                        <v-list-item-subtitle>Cooldown</v-list-item-subtitle>
                                                        {{command.cooldown}} seconds
                                                    </v-col>
                                                    <v-col class='flex-grow-0'>
                                                        <v-list-item-subtitle>User Level</v-list-item-subtitle>
                                                        {{command.userLevel}}
                                                    </v-col>
                                                    <v-col class='flex-grow-0'>
                                                        <v-dialog v-model="modifyDialog[command.alias]" attach="#commands" persistent max-width="50rem">
                                                            <template v-slot:activator="{ on }">
                                                                <v-btn color="primary" v-on="on" @click="cacheCurrentData">Modify</v-btn>
                                                            </template>
                                                            <v-card>
                                                                <v-card-title>Modify !{{command.alias}}</v-card-title>
                                                                <v-card-subtitle>Update the properties of the !{{command.alias}} command.</v-card-subtitle>
                                                                <v-card-text>
                                                                    <v-text-field 
                                                                        v-model="command.alias"
                                                                        label="Command Alias"
                                                                        hint="The name of this command"
                                                                        outlined dense persistent-hint/>
                                                                </v-card-text>
                                                                <v-card-text>
                                                                    <v-text-field
                                                                        v-model="command.message"
                                                                        label="Message"
                                                                        hint="The message to be displayed by this command"
                                                                        outlined dense persistent-hint/>
                                                                </v-card-text>
                                                                <v-card-text>
                                                                    <v-text-field
                                                                        v-model="command.cooldown"
                                                                        label="Cooldown Time"
                                                                        hint="The number of seconds until this command can be used again"
                                                                        outlined dense persistent-hint/>
                                                                </v-card-text>
                                                                <v-card-text>
                                                                    <v-select
                                                                        v-model="command.userLevel"
                                                                        :items="userLevels"
                                                                        label="User Level"
                                                                        hint="The required user type to use this command"
                                                                        outlined dense persistent-hint/>
                                                                </v-card-text>
                                                                <v-card-actions>
                                                                    <v-spacer/>
                                                                    <v-btn color="primary" text @click.stop="$set(modifyDialog, command.alias, false); cancelModify()">Cancel</v-btn>
                                                                    <v-btn color="primary" text @click.stop="$set(modifyDialog, command.alias, false); updateData()">Save</v-btn>
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
                            </v-tab-item>
                            <v-tab-item>

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
            channelData: {},
            dataCache: {},
            modifyDialog: {},
            tab: null,
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
    },
    mounted() {
        const channel = this.$store.state.userData.login;
        this.axios.get(`https://api.bot.mtheb.tv/chats/${channel}`).then(res => {
            if (res.status === 404) {
                this.channelExists = false;
                return;
            }
            this.axios.get(`https://api.bot.mtheb.tv/commands/${channel}`).then(res => {
                this.channelData = res.data;
                this.channelExists = true;
            }).catch(err => {
                console.log(`ERROR: ${err}`);
            });
        });
    },
}
</script>