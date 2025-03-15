'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export interface SelectableItem {
    id: string;
    name: string;
}

interface CustomComboboxProps {
    items: SelectableItem[];
    /**
     * If true, the combobox allows multiple selections.
     * If false (or omitted), only single selection is allowed.
     */
    multiple?: boolean;
    /**
     * For multiple select: an array of items.
     * For single select: a single item or null.
     */
    selected: SelectableItem[] | SelectableItem | null;
    onChange: (selected: SelectableItem[] | SelectableItem | null) => void;
    placeholder?: string;
}

export function CustomCombobox({
    items,
    multiple = false,
    selected,
    onChange,
    placeholder = 'Select option...',
}: CustomComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const filteredItems =
        query === ''
            ? items
            : items.filter((item) =>
                  item.name.toLowerCase().includes(query.toLowerCase()),
              );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between',
                        !selected && 'text-muted-foreground',
                    )}
                >
                    {multiple
                        ? Array.isArray(selected) && selected.length > 0
                            ? selected.map((s) => s.name).join(', ')
                            : placeholder
                        : selected
                          ? (selected as SelectableItem).name
                          : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {filteredItems.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.name}
                                    onSelect={() => {
                                        if (multiple) {
                                            // Multiple selection: toggle item in array
                                            if (Array.isArray(selected)) {
                                                if (
                                                    selected.some(
                                                        (s) => s.id === item.id,
                                                    )
                                                ) {
                                                    onChange(
                                                        selected.filter(
                                                            (s) =>
                                                                s.id !==
                                                                item.id,
                                                        ),
                                                    );
                                                } else {
                                                    onChange([
                                                        ...selected,
                                                        item,
                                                    ]);
                                                }
                                            } else {
                                                onChange([item]);
                                            }
                                        } else {
                                            // Single selection: select the item and close the popover
                                            onChange(item);
                                            setOpen(false);
                                        }
                                        setQuery('');
                                    }}
                                >
                                    {item.name}
                                    {multiple ? (
                                        Array.isArray(selected) &&
                                        selected.some(
                                            (s) => s.id === item.id,
                                        ) ? (
                                            <Check className="ml-auto h-4 w-4" />
                                        ) : null
                                    ) : selected &&
                                      (selected as SelectableItem).id ===
                                          item.id ? (
                                        <Check className="ml-auto h-4 w-4" />
                                    ) : null}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default CustomCombobox;
