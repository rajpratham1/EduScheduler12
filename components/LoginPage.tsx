// components/LoginPage.tsx
import React, { useState } from 'react';
import * as api from '../services/api.ts';
import { setupRecaptcha, sendOTP, verifyOTP, loginWithEmail } from '../services/firebase.ts';
import AuthLayout from './auth/AuthLayout.tsx';
import AuthInput from './auth/AuthInput.tsx';
import type { Page } from '../App.tsx';

interface LoginPageProps {
    onLogin: (user: any) => void;
    onNavigate: (page: Page) => void;
    message?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate, message }) => {
    const [usePhone, setUsePhone] = useState(true);
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            setIsLoading(true);
            const verifier = setupRecaptcha('recaptcha-container', true);
            const confirmation = await sendOTP(mobile.startsWith('+') ? mobile : '+91'+mobile, verifier);
            setConfirmationResult(confirmation);
        } catch (err:any) {
            setError(err.message || 'Failed to send OTP');
        } finally { setIsLoading(false); }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            setIsLoading(true);
            if (!confirmationResult) return setError('No OTP session');
            const user = await verifyOTP(confirmationResult, otp);
            onLogin(user);
        } catch (err:any) {
            setError(err.message || 'OTP verify failed');
        } finally { setIsLoading(false); }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            setIsLoading(true);
            const user = await loginWithEmail(email, password);
            onLogin(user);
        } catch (err:any) {
            setError(err.message || 'Email login failed');
        } finally { setIsLoading(false); }
    };

    return (
        <AuthLayout title="Sign in">
            <div id="recaptcha-container" />
            <div className="mb-4">
                <button className={`mr-2 ${usePhone ? 'font-bold' : ''}`} onClick={()=>setUsePhone(true)}>Phone</button>
                <button className={`${!usePhone ? 'font-bold' : ''}`} onClick={()=>setUsePhone(false)}>Email</button>
            </div>

            {usePhone ? (
                <>
                {!confirmationResult ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <AuthInput id="mobile" name="mobile" type="text" label="Mobile" value={mobile} onChange={e=>setMobile(e.target.value)} required />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full py-2 rounded bg-indigo-600 text-white">{isLoading?'Sending...':'Send OTP'}</button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <AuthInput id="otp" name="otp" type="text" label="OTP code" value={otp} onChange={e=>setOtp(e.target.value)} required />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full py-2 rounded bg-green-600 text-white">{isLoading?'Verifying...':'Verify & Login'}</button>
                    </form>
                )}
                </>
            ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <AuthInput id="email" name="email" type="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                    <AuthInput id="password" name="password" type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-2 rounded bg-indigo-600 text-white">{isLoading?'Signing in...':'Sign in'}</button>
                </form>
            )}

            <p className="mt-6 text-center text-sm">
                Not a member? <button onClick={()=>onNavigate('signup')} className="text-indigo-600">Create account</button>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;
