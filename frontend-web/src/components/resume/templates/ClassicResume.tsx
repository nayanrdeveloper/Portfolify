import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: 'Times-Roman', fontSize: 11, lineHeight: 1.4, color: '#000' },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '1px solid #000',
        paddingBottom: 15,
    },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase' },
    title: { fontSize: 12, marginBottom: 6, fontStyle: 'italic' },
    contactRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, fontSize: 10 },
    section: { marginBottom: 18 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        borderBottom: '1px solid #000',
        paddingBottom: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    jobItem: { marginBottom: 12 },
    jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    jobTitle: { fontWeight: 'bold', fontSize: 11 },
    company: { fontStyle: 'italic' },
    date: { fontSize: 10 },
    description: { marginTop: 2, textAlign: 'justify' },
    skillsText: { lineHeight: 1.6 },
    projectItem: { marginBottom: 10 },
    projectTitle: { fontWeight: 'bold', fontSize: 11 },
    link: { color: '#000', textDecoration: 'none' },
});

export const ClassicResume = ({ data }: { data: any }) => {
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
                        {userDetails?.website && (
                            <Link src={userDetails.website} style={styles.link}>
                                Portfolio
                            </Link>
                        )}
                    </View>
                </View>
                {userDetails?.about && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text>{userDetails.about}</Text>
                    </View>
                )}
                {experience?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        {experience.map((job: any, index: number) => (
                            <View key={index} style={styles.jobItem}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.jobTitle}>{job.position}</Text>
                                    <Text style={styles.date}>
                                        {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                                        {job.endDate
                                            ? new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                            : 'Present'}
                                    </Text>
                                </View>
                                <Text style={styles.company}>{job.company}</Text>
                                <Text style={styles.description}>{job.description}</Text>
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
                                        {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                                        {edu.endDate
                                            ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                            : 'Present'}
                                    </Text>
                                </View>
                                <Text style={styles.company}>{edu.institution}</Text>
                            </View>
                        ))}
                    </View>
                )}
                {skills?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={styles.skillsText}>
                            {skills.map((s: any) => s.name).join(' • ')}
                        </Text>
                    </View>
                )}
                {projects?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.slice(0, 4).map((project: any, index: number) => (
                            <View key={index} style={styles.projectItem}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.projectTitle}>{project.title}</Text>
                                    {project.projectUrl && (
                                        <Link src={project.projectUrl} style={styles.link}>
                                            Link
                                        </Link>
                                    )}
                                </View>
                                <Text style={styles.description}>{project.description}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};
