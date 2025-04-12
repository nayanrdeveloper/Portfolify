'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { icons } from 'lucide-react';
import { useState, useMemo } from 'react';

type IconPickerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onIconSelect: (iconName: string) => void;
};

export default function IconPicker({
    open,
    onOpenChange,
    onIconSelect,
}: IconPickerProps) {
    const [search, setSearch] = useState('');

    const filteredIcons = useMemo(() => {
        return Object.keys(icons).filter((iconName) =>
            iconName.toLowerCase().includes(search.toLowerCase()),
        );
    }, [search]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Select an Icon</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="Search icons..."
                    className="mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="grid grid-cols-6 gap-4 max-h-[400px] overflow-y-auto">
                    {filteredIcons.map((iconName) => {
                        const LucideIcon =
                            icons[iconName as keyof typeof icons];
                        return (
                            <button
                                key={iconName}
                                className="flex items-center justify-center p-2 border rounded hover:bg-gray-100"
                                onClick={() => {
                                    onIconSelect(iconName);
                                    onOpenChange(false);
                                }}
                            >
                                <LucideIcon className="h-6 w-6" />
                            </button>
                        );
                    })}
                </div>

                {filteredIcons.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                        No icons found
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
