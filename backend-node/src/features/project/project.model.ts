import { Schema, model } from 'mongoose';
import { Project } from './project.interface';

const projectSchema = new Schema<Project>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String, required: true },
        description: String,
        demoLink: String,
        githubLink: String,
        mediaUrls: [String],
        clicks: { type: Number, default: 0 },
    },
    { timestamps: true },
);

export const ProjectModel = model<Project>('Project', projectSchema);
