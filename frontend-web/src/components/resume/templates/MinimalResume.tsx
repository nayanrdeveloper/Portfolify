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
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 9, lineHeight: 1.6, color: '#000' },
    header: { marginBottom: 30 },
    name: { fontSize: 30, fontWeight: 'bold', marginBottom: 10, letterSpacing: -1 },
    title: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 15 },
    contactCol: { gap: 4, fontSize: 8, color: '#444' },
    main: { flexDirection: 'row', gap: 30 },
    leftCol: { width: '30%' },
    rightCol: { width: '70%' },
    section: { marginBottom: 20 },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        borderBottom: '2px solid #000',
        paddingBottom: 4,
    },
    jobItem: { marginBottom: 15 },
    jobTitle: { fontWeight: 'bold', fontSize: 10 },
    company: { fontSize: 9, marginBottom: 2 },
    date: { fontSize: 8, color: '#666', marginBottom: 4 },
    description: { fontSize: 9, color: '#333' },
    skillItem: { marginBottom: 4 },
    link: { color: '#000', textDecoration: 'none' },
});

export const MinimalResume = ({ data }: { data: any }) => {
    const { userDetails, experience, education, skills, projects, socialMedia } = data;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>{userDetails?.fullName}</Text>
                    <Text style={styles.title}>{userDetails?.title}</Text>
                    <View style={styles.contactCol}>
                        {userDetails?.email && <Text>{userDetails.email}</Text>}
                        {userDetails?.location && <Text>{userDetails.location}</Text>}
                        {userDetails?.website && (
                            <Link src={userDetails.website} style={styles.link}>
                                {userDetails.website}
                            </Link>
                        )}
                    </View>
                </View>

                <View style={styles.main}>
                    <View style={styles.leftCol}>
                        {skills?.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Skills</Text>
                                {skills.map((skill: any, index: number) => (
                                    <Text key={index} style={styles.skillItem}>
                                        {skill.name}
                                    </Text>
                                ))}
                            </View>
                        )}
                        {education?.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Education</Text>
                                {education.map((edu: any, index: number) => (
                                    <View key={index} style={{ marginBottom: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>{edu.degree}</Text>
                                        <Text>{edu.institution}</Text>
                                        <Text style={styles.date}>
                                            {new Date(edu.startDate).getFullYear()} -{' '}
                                            {edu.endDate
                                                ? new Date(edu.endDate).getFullYear()
                                                : 'Present'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.rightCol}>
                        {userDetails?.about && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Profile</Text>
                                <Text>{userDetails.about}</Text>
                            </View>
                        )}
                        {experience?.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Experience</Text>
                                {experience.map((job: any, index: number) => (
                                    <View key={index} style={styles.jobItem}>
                                        <Text style={styles.jobTitle}>{job.position}</Text>
                                        <Text style={styles.company}>{job.company}</Text>
                                        <Text style={styles.date}>
                                            {new Date(job.startDate).getFullYear()} -{' '}
                                            {job.endDate
                                                ? new Date(job.endDate).getFullYear()
                                                : 'Present'}
                                        </Text>
                                        <Text style={styles.description}>{job.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {projects?.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Projects</Text>
                                {projects.slice(0, 3).map((project: any, index: number) => (
                                    <View key={index} style={styles.jobItem}>
                                        <Text style={styles.jobTitle}>{project.title}</Text>
                                        <Text style={styles.description}>
                                            {project.description}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};
