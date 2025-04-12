import {
    Facebook,
    Github,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
} from 'lucide-react';

export const SOCIAL_MEDIA_CONSTANT = {
    pageTitle: 'My Social Media Links',
    submitButton: 'Save Links',
    cancelButton: 'Cancel',
    formFields: {
        linkedin: {
            id: 'linkedin',
            label: 'LinkedIn',
            tooltip: 'Enter your LinkedIn profile URL.',
            placeholder: 'https://linkedin.com/in/your-profile',
            icon: Linkedin,
        },
        twitter: {
            id: 'twitter',
            label: 'Twitter',
            tooltip: 'Enter your Twitter profile URL.',
            placeholder: 'https://twitter.com/your-profile',
            icon: Twitter,
        },
        facebook: {
            id: 'facebook',
            label: 'Facebook',
            tooltip: 'Enter your Facebook profile URL.',
            placeholder: 'https://facebook.com/your-profile',
            icon: Facebook,
        },
        instagram: {
            id: 'instagram',
            label: 'Instagram',
            tooltip: 'Enter your Instagram profile URL.',
            placeholder: 'https://instagram.com/your-profile',
            icon: Instagram,
        },
        github: {
            id: 'github',
            label: 'GitHub',
            tooltip: 'Enter your GitHub profile URL.',
            placeholder: 'https://github.com/your-profile',
            icon: Github,
        },
        youtube: {
            id: 'youtube',
            label: 'YouTube',
            tooltip: 'Enter your YouTube channel URL.',
            placeholder: 'https://youtube.com/@your-channel',
            icon: Youtube,
        },
    },
};
