import { comparePwd } from '../../core/auth/hash';
import { ConflictError, UnauthorizedError } from '../../core/errors/ApiError';
import { MSG } from '../../core/messages';
import { ensureUniqueSlug } from './slug.util';
import { User } from './user.interface';
import { toSlug, UserModel } from './user.model';

export class UserService {
    static async create(payload: Partial<User>) {
        const data = {
            ...payload,
            slug: payload.slug ?? toSlug(payload.fullName || ''),
        };
        return UserModel.create(data);
    }

    /* --- Register --- */
    static async register(data: {
        fullName: string;
        email: string;
        password: string;
        slug?: string;
    }) {
        /* 1 — duplicate email */
        if (await UserModel.exists({ email: data.email })) {
            throw new ConflictError(MSG.EMAIL_TAKEN(data.email));
        }

        /* 2 — prepare slug (given or from name) */
        const baseSlug = data.slug ? toSlug(data.slug) : toSlug(data.fullName);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        if (data.slug && baseSlug !== uniqueSlug) {
            // user supplied slug that already exists
            throw new ConflictError(`Slug '${data.slug}' is already in use`);
        }

        /* 3 — create */
        return UserModel.create({
            fullName: data.fullName,
            email: data.email,
            password: data.password, // hashed by pre-save hook
            slug: uniqueSlug,
        });
    }

    static async validateCredentials(email: string, plainPwd: string) {
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) throw new UnauthorizedError(MSG.INVALID_CRED());

        const ok = await comparePwd(plainPwd, user.password);
        if (!ok) throw new UnauthorizedError(MSG.INVALID_CRED());

        return user;
    }

    static async getById(id: string) {
        return UserModel.findById(id).lean();
    }

    static async getByEmail(email: string) {
        return UserModel.findOne({ email }).lean();
    }

    static async getBySlug(slug: string) {
        return UserModel.findOne({ slug }).lean();
    }
}
