<template>
    <v-dialog v-model="contactDialog" attach="#app" persistent max-width="50rem">
        <v-row class='mx-0' style='position: relative'>
            <v-card width="100%">
                <v-card-title>Contact</v-card-title>
                <v-card-text v-if="contactError" style="color: #FF5252">There was an error sending your message.  Please try again later.</v-card-text>
                <v-form v-model="contactFormValid">
                    <v-card-text class='mb-n4'>
                        <v-text-field 
                            v-model="contactData.name"
                            label="Name"
                            hide-details="auto"
                            maxlength="70"
                            :rules="[validationRules.required]"
                            outlined dense required/>
                    </v-card-text>
                    <v-card-text class='mb-n4'>
                        <v-text-field 
                            v-model="contactData.email"
                            label="Email"
                            hide-details="auto"
                            :rules="[validationRules.required, validationRules.email]"
                            outlined dense required/>
                    </v-card-text>
                    <v-card-text>
                        <v-select
                            v-model="contactData.type"
                            :items="contactTypes"
                            label="Contact Type"
                            hide-details="auto"
                            outlined dense/>
                    </v-card-text>
                    <v-card-text class='mb-n4'>
                        <v-text-field 
                            v-model="contactData.subject"
                            label="Subject"
                            hide-details="auto"
                            maxlength="30"
                            :rules="[validationRules.required]"
                            outlined dense counter required/>
                    </v-card-text>
                    <v-card-text class='mb-n4'>
                        <v-textarea 
                            v-model="contactData.message"
                            label="Message"
                            hide-details="auto"
                            maxlength="500"
                            :rules="[validationRules.required]"
                            outlined dense counter auto-grow required/>
                    </v-card-text>
                </v-form>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" text @click="close">Cancel</v-btn>
                    <v-btn color="primary" text @click="sendContact">Send</v-btn>
                </v-card-actions>
            </v-card>
            <v-overlay :value="isSending" opacity=".15" absolute>
                <v-progress-circular indeterminate color="primary" size="64"/>
            </v-overlay>
        </v-row>
    </v-dialog>
</template>

<script>
import validationRules from '../defaults/validationRules';

export default {
    name: 'ContactDialog',
    data: function() {
        return {
            contactData: {
                name: '',
                email: '',
                type: 'General',
                subject: '',
                message: '',
            },
            contactError: false,
            contactTypes: ['Help', 'Bug Report', 'Suggestion', 'Feedback', 'General'],
            contactFormValid: true,
            isSending: false,
            validationRules: validationRules,
        }
    },
    computed: {
        contactDialog() {
            return this.$store.state.contactDialog;
        },
    },
    methods: {
        close: function() {
            this.contactData = {
                name: '',
                email: '',
                type: 'General',
                subject: '',
                message: '',
            }
            this.contactError = false;
            this.isSending = false;
            this.$store.commit('setContactDialog', false);
        },
        sendContact: function() {
            if (this.contactFormValid) {
                this.isSending = true;
                this.axios.post('/contact', this.contactData).then(() => {
                    this.close();
                }).catch(() => {
                    this.contactError = true;
                    this.isSending = false;
                });
            }
        }
    }
}
</script>