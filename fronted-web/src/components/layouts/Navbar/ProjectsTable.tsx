'use client';

import React from 'react';
import {
    useGetProjectsBySlugQuery,
    useDeleteProjectMutation,
} from '@/redux/projects/projectApi';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react'; // Trash icon from lucide-react
import { Project } from '@/redux/projects/projectsTypes';
import TableSkeleton from '@/components/ui/TableSkeleton';
// import type { Project } from "@/redux/projects/projectType";

interface ProjectsTableProps {
    // Optionally pass a user slug; default provided for demo.
    userSlug?: string;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
    userSlug = 'nayanrdeveloper',
}) => {
    // Fetch projects using RTK Query
    const { data, isLoading, isError } = useGetProjectsBySlugQuery(userSlug);
    const [deleteProject, { isLoading: isDeleting }] =
        useDeleteProjectMutation();

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id).unwrap();
                alert('Project deleted successfully.');
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete project.');
            }
        }
    };

    if (isLoading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    if (isError || !data) {
        return <div>Error loading projects.</div>;
    }

    // Assume API returns: { status: "success", message: string, data: Project[] }
    const projects: Project[] = Array.isArray(data.data) ? data.data : [];

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">
                            Description
                        </th>
                        <th className="border px-4 py-2 text-left">Demo</th>
                        <th className="border px-4 py-2 text-left">GitHub</th>
                        <th className="border px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project: Project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{project.name}</td>
                            <td className="border px-4 py-2">
                                {project.description}
                            </td>
                            <td className="border px-4 py-2">
                                <a
                                    href={project.demo_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    Demo
                                </a>
                            </td>
                            <td className="border px-4 py-2">
                                <a
                                    href={project.github_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    GitHub
                                </a>
                            </td>
                            <td className="border px-4 py-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        handleDelete(String(project.id))
                                    }
                                    disabled={isDeleting}
                                    className="flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsTable;
