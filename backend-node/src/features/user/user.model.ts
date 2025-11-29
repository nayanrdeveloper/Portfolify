import { Schema, model } from 'mongoose';
import { hashPassword } from '../../core/auth/hash';
import { User } from './user.interface';

export const toSlug = (name: string) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // spaces & symbols → hyphens
        .replace(/(^-|-$)+/g, ''); // trim leading/trailing -

const userSchema = new Schema<User>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        avatarUrl: { type: String },
        isOnboardingCompleted: { type: Boolean, default: false },
        profileViews: { type: Number, default: 0 },
    },
    { timestamps: true },
);

/* ---------- pre-save hook to ensure slug ---------- */
userSchema.pre('validate', function (next) {
    if (!this.slug && this.fullName) {
        this.slug = toSlug(this.fullName);
    }
    next();
});

/* hash password on create / update */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await hashPassword(this.password);
    next();
});

export const UserModel = model<User>('User', userSchema);
