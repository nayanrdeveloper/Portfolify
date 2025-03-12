'use client';

import React from 'react';

export interface UserDetails {
    id: number;
    title: string;
    bio: string;
    location: string;
    profilePictureURL: string;
    githubURL: string;
    linkedInURL: string;
    twitterURL: string;
}

interface UserDetailsTableProps {
    details: UserDetails[];
}

const UserDetailsTable: React.FC<UserDetailsTableProps> = ({ details }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Title</th>
                        <th className="border px-4 py-2 text-left">Bio</th>
                        <th className="border px-4 py-2 text-left">Location</th>
                        <th className="border px-4 py-2 text-left">
                            Profile Picture
                        </th>
                        <th className="border px-4 py-2 text-left">GitHub</th>
                        <th className="border px-4 py-2 text-left">LinkedIn</th>
                        <th className="border px-4 py-2 text-left">Twitter</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail) => (
                        <tr key={detail.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{detail.title}</td>
                            <td className="border px-4 py-2">{detail.bio}</td>
                            <td className="border px-4 py-2">
                                {detail.location}
                            </td>
                            <td className="border px-4 py-2">
                                <img
                                    src={detail.profilePictureURL}
                                    alt={detail.title}
                                    className="w-10 h-10 rounded"
                                />
                            </td>
                            <td className="border px-4 py-2">
                                <a
                                    href={detail.githubURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    GitHub
                                </a>
                            </td>
                            <td className="border px-4 py-2">
                                <a
                                    href={detail.linkedInURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    LinkedIn
                                </a>
                            </td>
                            <td className="border px-4 py-2">
                                <a
                                    href={detail.twitterURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    Twitter
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserDetailsTable;
