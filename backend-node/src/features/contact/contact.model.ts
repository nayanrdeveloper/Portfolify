import { Schema, model } from 'mongoose';
import { ContactMessage } from './contact.interface';

const contactSchema = new Schema<ContactMessage>(
    {
        ownerUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String, required: true },
        email: String,
        phoneNumber: String,
        message: { type: String, required: true },
    },
    { timestamps: true },
);

export const ContactModel = model<ContactMessage>('ContactMessage', contactSchema);
