'use client';

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    useGetMyUserDetailsQuery,
    useUpdateMyUserDetailsMutation,
} from '@/redux/userdetails/userdetailsApi';
import { useUploadSingleMutation } from '@/redux/uploads/uploadsApi';
import { InputWithLabel } from '../common/InputWithLabel';
import { USER_DETAIL_CONSTANT } from '@/constants/userDetailsConstant';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    setUserDetails,
    updateUserField,
} from '@/redux/userdetails/userDetailsSlice';
import FormSkeleton from '../common/FormSkeleton';
import Image from 'next/image';

export default function UserDetailsForm() {
    const dispatch = useAppDispatch();
    const form = useAppSelector((state) => state.userDetails.userDetails);
    const { formFields, sections } = USER_DETAIL_CONSTANT;

    const { data: detailsData, isLoading, error } = useGetMyUserDetailsQuery();
    const [updateMyUserDetails, { isLoading: isUpdating }] =
        useUpdateMyUserDetailsMutation();
    const [uploadSingle] = useUploadSingleMutation();
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        dispatch(updateUserField({ field: id as keyof typeof form, value }));
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setProfilePicFile(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let secureURL = profilePicPreview;

        if (profilePicFile) {
            try {
                const secureUrl = await uploadSingle({
                    file: profilePicFile,
                    folder: 'profile_pics',
                }).unwrap();

                secureURL = secureUrl;
            } catch (err) {
                console.error('Image upload failed:', err);
            }
        }

        try {
            await updateMyUserDetails({
                ...form,
                profilePictureUrl: secureURL,
                yearsOfExperience: Number(form.yearsOfExperience),
            }).unwrap();
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    useEffect(() => {
        if (detailsData) {
            dispatch(setUserDetails(detailsData));
            if (detailsData.profilePictureUrl) {
                setProfilePicPreview(detailsData.profilePictureUrl);
            }
        }
    }, [detailsData, dispatch]);

    if (isLoading) return <FormSkeleton fields={12} columns={3} />;
    if (error) return <p className="text-center mt-10">Error loading data.</p>;

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold mb-8">
                    {USER_DETAIL_CONSTANT.pageTitle}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <section className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            {sections.personal}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputWithLabel
                                label={formFields.fullName.label}
                                id={formFields.fullName.id}
                                value={form.fullName}
                                onChange={handleChange}
                                type="text"
                                placeholder={formFields.fullName.placeholder}
                                required
                                tooltip={formFields.fullName.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.email.label}
                                id={formFields.email.id}
                                value={form.email}
                                onChange={handleChange}
                                type="email"
                                placeholder={formFields.email.placeholder}
                                required
                            />
                            <InputWithLabel
                                label={formFields.phoneNumber.label}
                                id={formFields.phoneNumber.id}
                                value={form.phoneNumber}
                                onChange={handleChange}
                                type="tel"
                                placeholder={formFields.phoneNumber.placeholder}
                                tooltip={formFields.phoneNumber.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.location.label}
                                id={formFields.location.id}
                                value={form.location}
                                onChange={handleChange}
                                type="text"
                                placeholder={formFields.location.placeholder}
                                required
                                tooltip={formFields.location.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.dateOfBirth.label}
                                id={formFields.dateOfBirth.id}
                                value={form.dateOfBirth}
                                onChange={handleChange}
                                type="date"
                                placeholder={formFields.dateOfBirth.placeholder}
                                tooltip={formFields.dateOfBirth.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.websiteUrl.label}
                                id={formFields.websiteUrl.id}
                                value={form.websiteUrl}
                                onChange={handleChange}
                                type="url"
                                placeholder={formFields.websiteUrl.placeholder}
                                tooltip={formFields.websiteUrl.tooltip}
                            />
                        </div>

                        {/* Profile Pic Upload */}
                        <div className="mt-6">
                            <Label htmlFor="profile_picture">
                                Profile Picture
                            </Label>
                            <Input
                                type="file"
                                id="profile_picture"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                            />
                            {profilePicPreview && (
                                <Image
                                    src={profilePicPreview}
                                    width={96}
                                    height={96}
                                    alt={`Profile Preview`}
                                    className="mt-3 w-24 h-24 rounded object-cover border"
                                />
                            )}
                        </div>
                    </section>

                    {/* PROFESSIONAL INFO SECTION */}
                    <section className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            Professional Info
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputWithLabel
                                label={formFields.title.label}
                                id={formFields.title.id}
                                value={form.title}
                                onChange={handleChange}
                                type="text"
                                required
                                placeholder={formFields.title.placeholder}
                                tooltip={formFields.title.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.subTitle.label}
                                id={formFields.subTitle.id}
                                value={form.subTitle}
                                onChange={handleChange}
                                type="text"
                                placeholder={formFields.subTitle.placeholder}
                                tooltip={formFields.subTitle.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.currentCompany.label}
                                id={formFields.currentCompany.id}
                                value={form.currentCompany}
                                onChange={handleChange}
                                type="text"
                                placeholder={
                                    formFields.currentCompany.placeholder
                                }
                                tooltip={formFields.currentCompany.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.yearsOfExperience.label}
                                id={formFields.yearsOfExperience.id}
                                value={form.yearsOfExperience}
                                onChange={handleChange}
                                type="number"
                                placeholder={
                                    formFields.yearsOfExperience.placeholder
                                }
                                tooltip={formFields.yearsOfExperience.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.resumeUrl.label}
                                id={formFields.resumeUrl.id}
                                value={form.resumeUrl}
                                onChange={handleChange}
                                type="text"
                                placeholder={formFields.resumeUrl.placeholder}
                                tooltip={formFields.resumeUrl.tooltip}
                            />
                        </div>
                    </section>

                    {/* HERO SECTION */}
                    <section className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            {sections.hero}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputWithLabel
                                label={formFields.about.label}
                                id={formFields.about.id}
                                value={form.about}
                                onChange={handleChange}
                                type="text"
                                required
                                placeholder={formFields.about.placeholder}
                                tooltip={formFields.about.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.greetingText.label}
                                id={formFields.greetingText.id}
                                value={form.greetingText}
                                onChange={handleChange}
                                required
                                type="text"
                                placeholder={
                                    formFields.greetingText.placeholder
                                }
                                tooltip={formFields.greetingText.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.headLine.label}
                                id={formFields.headLine.id}
                                value={form.headLine}
                                onChange={handleChange}
                                type="text"
                                required
                                placeholder={formFields.headLine.placeholder}
                                tooltip={formFields.headLine.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.callToAction.label}
                                id={formFields.callToAction.id}
                                value={form.callToActionMessage}
                                onChange={handleChange}
                                type="text"
                                placeholder={
                                    formFields.callToAction.placeholder
                                }
                                tooltip={formFields.callToAction.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.quote.label}
                                id={formFields.quote.id}
                                value={form.quote}
                                onChange={handleChange}
                                type="text"
                                placeholder={formFields.quote.placeholder}
                                tooltip={formFields.quote.tooltip}
                            />
                            <InputWithLabel
                                label={formFields.funFact.label}
                                id={formFields.funFact.id}
                                value={form.funFact}
                                onChange={handleChange}
                                type="text"
                                placeholder={formFields.funFact.placeholder}
                                tooltip={formFields.funFact.tooltip}
                            />
                        </div>
                    </section>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Saving...' : 'Save Details'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
