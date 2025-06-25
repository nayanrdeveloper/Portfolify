// constants/userDetailsForm.ts

export const USER_DETAIL_CONSTANT = {
    pageTitle: 'My User Details',
    submitButton: 'Save Details',
    cancelButton: 'Cancel',

    sections: {
        personal: 'Personal Info',
        professional: 'Professional Info',
        hero: 'Hero Section',
    },

    formFields: {
        fullName: {
            id: 'fullName',
            label: 'Full Name',
            tooltip: 'Your complete name to display on your portfolio.',
            placeholder: 'Nayan Radadiya',
            required: true,
        },
        title: {
            id: 'title',
            label: 'Title',
            tooltip: 'Your professional title or role.',
            placeholder: 'Frontend Developer',
        },
        subTitle: {
            id: 'subTitle',
            label: 'Subtitle',
            tooltip: 'A short tagline that describes you.',
            placeholder: 'I build clean and modern UIs',
        },
        about: {
            id: 'about',
            label: 'About',
            tooltip:
                'A short paragraph about yourself, your goals, and your interests.',
            placeholder:
                "I'm a software developer passionate about solving real-world problems.",
        },
        location: {
            id: 'location',
            label: 'Location',
            tooltip: 'Where you’re based. Mention city and country.',
            placeholder: 'Bangalore, India',
        },
        profilePicture: {
            id: 'profilePictureUrl',
            label: 'Profile Picture',
            tooltip: 'Direct URL to your profile image (JPG, PNG, etc.)',
            placeholder: 'https://example.com/avatar.jpg',
        },
        email: {
            id: 'email',
            label: 'Email',
            tooltip: 'Your professional email for contact.',
            placeholder: 'nayan@email.com',
        },
        currentCompany: {
            id: 'currentCompany',
            label: 'Current Company',
            tooltip: 'Your current employer or organization.',
            placeholder: 'TCS',
        },
        yearsOfExperience: {
            id: 'yearsOfExperience',
            label: 'Years of Experience',
            tooltip: 'Total number of years you’ve worked professionally.',
            placeholder: '4',
        },
        phoneNumber: {
            id: 'phoneNumber',
            label: 'Phone Number',
            tooltip: 'Your phone number if you’d like to show it.',
            placeholder: '+91-9876543210',
        },
        resumeUrl: {
            id: 'resumeUrl',
            label: 'Resume URL',
            tooltip: 'Direct link to download your resume (PDF or hosted).',
            placeholder: 'https://example.com/resume.pdf',
        },
        dateOfBirth: {
            id: 'dateOfBirth',
            label: 'Date of Birth',
            tooltip: 'Your birth date (optional).',
            placeholder: '1995-05-14',
        },
        websiteUrl: {
            id: 'websiteUrl',
            label: 'Website',
            tooltip: 'Your personal blog or website URL.',
            placeholder: 'https://nayan.dev',
        },
        greetingText: {
            id: 'greetingText',
            label: 'Greeting Text',
            tooltip: 'Friendly intro line to start your profile.',
            placeholder: "Hi! I'm Nayan 👋",
        },
        headLine: {
            id: 'headLine',
            label: 'Headline',
            tooltip: 'A short line about what you do or specialize in.',
            placeholder:
                'I craft scalable web applications with React & GoLang.',
        },
        callToAction: {
            id: 'callToActionMessage',
            label: 'Call to Action',
            tooltip: 'Encouragement message to get visitors to contact you.',
            placeholder: "Let's connect — feel free to reach out!",
        },
        quote: {
            id: 'quote',
            label: 'Quote',
            tooltip:
                'Your favorite quote or one that reflects your personality.',
            placeholder:
                'Code is like humor. When you have to explain it, it’s bad.',
        },
        funFact: {
            id: 'funFact',
            label: 'Fun Fact',
            tooltip: 'Something interesting or unique about you.',
            placeholder: 'I built my first app in just 2 days 🚀',
        },
    },
};
