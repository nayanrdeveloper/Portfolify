'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
// import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { Loader2, Mail, Phone, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Message {
    _id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    message: string;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact/messages');
            setMessages(res.data.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
            toast({
                title: 'Error',
                description: 'Failed to load messages. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/contact/${id}`);
            setMessages(prev => prev.filter(msg => msg._id !== id));
            toast({
                title: 'Success',
                description: 'Message deleted successfully.',
            });
        } catch (error) {
            console.error('Failed to delete message', error);
            toast({
                title: 'Error',
                description: 'Failed to delete message.',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-4">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No messages yet</h3>
                <p className="text-muted-foreground">
                    When people contact you via your portfolio, their messages will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                    Manage inquiries from your portfolio visitors.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {messages.map(msg => (
                    <Card key={msg._id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{msg.name}</CardTitle>
                                        <CardDescription>
                                            {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-2 text-sm">
                            {msg.email && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <a href={`mailto:${msg.email}`} className="hover:underline">
                                        {msg.email}
                                    </a>
                                </div>
                            )}
                            {msg.phoneNumber && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <a href={`tel:${msg.phoneNumber}`} className="hover:underline">
                                        {msg.phoneNumber}
                                    </a>
                                </div>
                            )}
                            <div className="mt-4 line-clamp-3 text-foreground/90">
                                {msg.message}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Read Full
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Message from {msg.name}</DialogTitle>
                                        <DialogDescription>
                                            Sent on{' '}
                                            {new Date(msg.createdAt).toLocaleString(undefined, {
                                                dateStyle: 'full',
                                                timeStyle: 'short',
                                            })}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid gap-2 text-sm">
                                            {msg.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span>{msg.email}</span>
                                                </div>
                                            )}
                                            {msg.phoneNumber && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span>{msg.phoneNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="rounded-md bg-muted p-4 text-sm">
                                            {msg.message}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleDelete(msg._id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
