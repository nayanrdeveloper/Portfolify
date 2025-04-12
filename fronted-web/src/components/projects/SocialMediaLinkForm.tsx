'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputWithLabel } from '../common/InputWithLabel';
import { SOCIAL_MEDIA_CONSTANT } from '@/constants/socialMediaConstant';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    useGetSocialMediaBySlugQuery,
    useUpdateSocialMediaMutation,
} from '@/redux/socialMedia/socialMediaApi';
import {
    setSocialMedia,
    updateSocialMediaField,
} from '@/redux/socialMedia/socialMediaSlice';
import FormSkeleton from '../common/FormSkeleton';

export default function SocialMediaLinksForm() {
    const { formFields } = SOCIAL_MEDIA_CONSTANT;
    const form = useAppSelector(
        (state) => state.socialMedia.socialMediaDetails,
    );
    const { slug } = useAppSelector((state) => state.auth.userProfile);
    const dispatch = useAppDispatch();

    const { data, isLoading } = useGetSocialMediaBySlugQuery(slug);
    const [updateSocialMedia, { isLoading: isUpdating }] =
        useUpdateSocialMediaMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            updateSocialMediaField({
                field: e.target.id as keyof typeof form,
                value: e.target.value,
            }),
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSocialMedia(form).unwrap();
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    useEffect(() => {
        if (data?.data) {
            dispatch(setSocialMedia(data.data));
        }
    }, [data, dispatch]);

    if (isLoading)
        return <FormSkeleton fields={3} columns={2} variant="default" />;

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold mb-8">
                    {SOCIAL_MEDIA_CONSTANT.pageTitle}
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-10 bg-white rounded-xl shadow p-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <InputWithLabel
                            label={formFields.linkedin.label}
                            id={formFields.linkedin.id}
                            value={form.linkedin}
                            onChange={handleChange}
                            type="url"
                            placeholder={formFields.linkedin.placeholder}
                            tooltip={formFields.linkedin.tooltip}
                            icon={formFields.linkedin.icon}
                        />
                        <InputWithLabel
                            label={formFields.twitter.label}
                            id={formFields.twitter.id}
                            value={form.twitter}
                            onChange={handleChange}
                            type="url"
                            placeholder={formFields.twitter.placeholder}
                            tooltip={formFields.twitter.tooltip}
                            icon={formFields.twitter.icon}
                        />
                        <InputWithLabel
                            label={formFields.facebook.label}
                            id={formFields.facebook.id}
                            value={form.facebook}
                            onChange={handleChange}
                            type="url"
                            placeholder={formFields.facebook.placeholder}
                            tooltip={formFields.facebook.tooltip}
                            icon={formFields.facebook.icon}
                        />
                        <InputWithLabel
                            label={formFields.instagram.label}
                            id={formFields.instagram.id}
                            value={form.instagram}
                            onChange={handleChange}
                            type="url"
                            placeholder={formFields.instagram.placeholder}
                            tooltip={formFields.instagram.tooltip}
                            icon={formFields.instagram.icon}
                        />
                        <InputWithLabel
                            label={formFields.github.label}
                            id={formFields.github.id}
                            value={form.github}
                            onChange={handleChange}
                            type="url"
                            placeholder={formFields.github.placeholder}
                            tooltip={formFields.github.tooltip}
                            icon={formFields.github.icon}
                        />
                        <InputWithLabel
                            label={formFields.youtube.label}
                            id={formFields.youtube.id}
                            value={form.youtube}
                            onChange={handleChange}
                            type="url"
                            placeholder={formFields.youtube.placeholder}
                            tooltip={formFields.twitter.tooltip}
                            icon={formFields.youtube.icon}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isUpdating}
                    >
                        {SOCIAL_MEDIA_CONSTANT.submitButton}
                    </Button>
                </form>
            </div>
        </div>
    );
}
