import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf' },
        {
            src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf',
            fontWeight: 'bold',
        },
    ],
});

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5, color: '#333' },
    header: { marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#111' },
    title: { fontSize: 14, color: '#666', marginBottom: 8 },
    contactRow: { flexDirection: 'row', gap: 12, fontSize: 9, color: '#666' },
    section: { marginBottom: 15 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        borderBottom: '1px solid #eee',
        paddingBottom: 4,
        marginBottom: 8,
        color: '#2563eb',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    jobItem: { marginBottom: 10 },
    jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    jobTitle: { fontWeight: 'bold', fontSize: 11 },
    company: { fontWeight: 'bold', color: '#444' },
    date: { color: '#666', fontSize: 9 },
    description: { marginTop: 4, color: '#555' },
    skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    skillBadge: { backgroundColor: '#f1f5f9', padding: '4 8', borderRadius: 4, fontSize: 9 },
    projectItem: { marginBottom: 10 },
    projectTitle: { fontWeight: 'bold', fontSize: 11, marginBottom: 2 },
    link: { color: '#2563eb', textDecoration: 'none' },
});

export const ModernResume = ({ data }: { data: any }) => {
    const { userDetails, experience, education, skills, projects, socialMedia } = data;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>{userDetails?.fullName}</Text>
                    <Text style={styles.title}>{userDetails?.title}</Text>
                    <View style={styles.contactRow}>
                        {userDetails?.email && <Text>{userDetails.email}</Text>}
                        {userDetails?.location && <Text>• {userDetails.location}</Text>}
                        {socialMedia?.linkedin && (
                            <Link src={socialMedia.linkedin} style={styles.link}>
                                LinkedIn
                            </Link>
                        )}
                        {socialMedia?.github && (
                            <Link src={socialMedia.github} style={styles.link}>
                                GitHub
                            </Link>
                        )}
                        {userDetails?.website && (
                            <Link src={userDetails.website} style={styles.link}>
                                Portfolio
                            </Link>
                        )}
                    </View>
                </View>
                {userDetails?.about && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text>{userDetails.about}</Text>
                    </View>
                )}
                {experience?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {experience.map((job: any, index: number) => (
                            <View key={index} style={styles.jobItem}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.jobTitle}>
                                        {job.position}{' '}
                                        <Text style={{ fontWeight: 'normal' }}>at</Text>{' '}
                                        <Text style={styles.company}>{job.company}</Text>
                                    </Text>
                                    <Text style={styles.date}>
                                        {new Date(job.startDate).getFullYear()} -{' '}
                                        {job.endDate
                                            ? new Date(job.endDate).getFullYear()
                                            : 'Present'}
                                    </Text>
                                </View>
                                <Text style={styles.description}>{job.description}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {skills?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Technical Skills</Text>
                        <View style={styles.skillsRow}>
                            {skills.map((skill: any, index: number) => (
                                <Text key={index} style={styles.skillBadge}>
                                    {skill.name}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}
                {projects?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Key Projects</Text>
                        {projects.slice(0, 4).map((project: any, index: number) => (
                            <View key={index} style={styles.projectItem}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.projectTitle}>{project.title}</Text>
                                    {project.projectUrl && (
                                        <Link src={project.projectUrl} style={styles.link}>
                                            View Project
                                        </Link>
                                    )}
                                </View>
                                <Text style={styles.description}>{project.description}</Text>
                                {project.technologies && (
                                    <Text style={{ ...styles.date, marginTop: 2 }}>
                                        Tech: {project.technologies.join(', ')}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}
                {education?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {education.map((edu: any, index: number) => (
                            <View key={index} style={styles.jobItem}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.jobTitle}>{edu.degree}</Text>
                                    <Text style={styles.date}>
                                        {new Date(edu.startDate).getFullYear()} -{' '}
                                        {edu.endDate
                                            ? new Date(edu.endDate).getFullYear()
                                            : 'Present'}
                                    </Text>
                                </View>
                                <Text style={styles.company}>{edu.institution}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};
