import { UserModel } from './user.model';

export const toSlug = (name: string) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

export const ensureUniqueSlug = async (base: string) => {
    let slug = base;
    let counter = 1;
    while (await UserModel.exists({ slug })) {
        slug = `${base}-${counter++}`;
    }
    return slug;
};
