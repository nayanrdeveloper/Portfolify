'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoginForm } from '@/components/pages/auth/login-form';
import { RegisterForm } from '@/components/pages/auth/register-form';

export default function AuthPage() {
    return (
        <div className="mx-auto max-w-md py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome</h1>

            <Tabs defaultValue="login">
                {/* Tabs navigation */}
                <TabsList className="mb-6 flex justify-center">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Tab content: LOGIN */}
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>

                {/* Tab content: REGISTER */}
                <TabsContent value="register">
                    <RegisterForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
