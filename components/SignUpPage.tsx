// components/SignUpPage.tsx
import React, { useState } from 'react';
import * as api from '../services/api.ts';
import { setupRecaptcha, sendOTP, verifyOTP, generateUniqueId, upsertUser, registerWithEmail } from '../services/firebase.ts';
import AuthLayout from './auth/AuthLayout.tsx';
import AuthInput from './auth/AuthInput.tsx';
import type { Page } from '../App.tsx';

interface SignUpPageProps {
    onSignUpSuccess: () => void;
    onNavigate: (page: Page) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onNavigate }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student'|'faculty'>('student');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [otp, setOtp] = useState('');

    const handleGetOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!mobile) return setError('Mobile required for OTP');
        try {
            setIsLoading(true);
            const verifier = setupRecaptcha('recaptcha-container', true);
            const confirmation = await sendOTP(mobile.startsWith('+') ? mobile : '+91'+mobile, verifier);
            setConfirmationResult(confirmation);
            setStep(2);
        } catch (err:any) {
            setError(err.message || 'Failed to send OTP');
        } finally { setIsLoading(false); }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!confirmationResult) return setError('No OTP session found');
        try {
            setIsLoading(true);
            const user = await verifyOTP(confirmationResult, otp);
            // create user document in Firestore
            const uid = generateUniqueId(role === 'faculty' ? 'FAC' : 'STD');
            await upsertUser(role === 'faculty' ? 'faculty' : 'students', uid, {
                uid,
                name,
                mobile,
                email,
                role,
                createdAt: Date.now(),
                avatar: '',
            });
            // Optionally also register email/password for fallback
            if (email && password) {
                try { await registerWithEmail(email, password); } catch (e) { /* ignore */ }
            }
            onSignUpSuccess();
        } catch (err:any) {
            setError(err.message || 'OTP verification failed');
        } finally { setIsLoading(false); }
    };

    return (
        <AuthLayout title="Create an account">
            <div id="recaptcha-container" />
            {step === 1 && (
                <form className="space-y-4" onSubmit={handleGetOtp}>
                    <AuthInput id="name" name="name" type="text" label="Full name" value={name} onChange={e=>setName(e.target.value)} required />
                    <AuthInput id="email" name="email" type="email" label="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} />
                    <AuthInput id="mobile" name="mobile" type="text" label="Mobile (10 digits)" value={mobile} onChange={e=>setMobile(e.target.value)} required />
                    <AuthInput id="password" name="password" type="password" label="Password (optional)" value={password} onChange={e=>setPassword(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium">I am a</label>
                        <div className="mt-2 flex gap-4">
                           <label className="inline-flex items-center"><input type="radio" checked={role==='student'} onChange={()=>setRole('student')} /> <span className="ml-2">Student</span></label>
                           <label className="inline-flex items-center"><input type="radio" checked={role==='faculty'} onChange={()=>setRole('faculty')} /> <span className="ml-2">Faculty</span></label>
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-2 rounded bg-indigo-600 text-white">{isLoading?'Sending OTP...':'Send OTP'}</button>
                    <p className="text-sm text-center mt-2">Or sign up with email (password will be optional).</p>
                </form>
            )}
            {step === 2 && (
                <form className="space-y-4" onSubmit={handleVerifyOtp}>
                    <AuthInput id="otp" name="otp" type="text" label="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} required />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-2 rounded bg-green-600 text-white">{isLoading?'Verifying...':'Verify & Create Account'}</button>
                </form>
            )}

            <p className="mt-6 text-center text-sm">
                Already have account? <button onClick={()=>onNavigate('login')} className="text-indigo-600">Login</button>
            </p>
        </AuthLayout>
    );
};

export default SignUpPage;
