'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Extended from ShadCN UI's InputProps, so we inherit all typical <input> behavior (type, placeholder, disabled, etc.)
 */
export interface InputWithLabelProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Label text displayed above the input */
    label: string;
    /** If true, display a red asterisk next to the label. */
    required?: boolean;
    /** If present, show an error message and highlight the input border in red. */
    error?: string;
    /** Tooltip text that appears when hovering an icon next to the label. */
    tooltip?: string;
    /**
     * Icon component to render alongside the label.
     * Pass the icon component type (e.g. GitHub) rather than a React node.
     */
    icon?: React.ElementType;
    /**
     * Optional className for the icon.
     * This allows you to customize the icon styling without wrapping it.
     */
    iconClassName?: string;
    className?: string;
    /** Optional ID for input and label "for" attribute. */
    id?: string;
}

export function InputWithLabel({
    label,
    required,
    error,
    tooltip,
    icon,
    iconClassName,
    id,
    className,
    ...props
}: InputWithLabelProps) {
    // If no explicit id is passed, we generate one from the label text
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col space-y-1">
            <Label
                htmlFor={inputId}
                className="text-sm font-medium text-gray-700 flex items-center"
            >
                {icon && (
                    // Render the icon component with default margin and any additional classes passed via iconClassName
                    <span className="mr-2">
                        {React.createElement(icon, {
                            className: cn('w-4 h-4', iconClassName),
                        })}
                    </span>
                )}
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
                {tooltip && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer inline-flex">
                                <HelpCircle className="w-4 h-4" />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                )}
            </Label>

            <Input
                id={inputId}
                className={cn(
                    error ? 'border-red-500 focus-visible:ring-red-500' : '',
                    className,
                )}
                {...props}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
