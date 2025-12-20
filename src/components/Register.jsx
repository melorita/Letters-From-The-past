import { useState } from 'react';
import { api } from '../services/api';

function Register({ onRegisterSuccess, onShowLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Strict Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})$/;
        const match = email.match(emailRegex);

        if (!match) {
            setError('Please enter a valid email address (e.g., name@gmail.com)');
            return;
        }

        const domain = match[1].toLowerCase();
        const commonProviders = [
            'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
            'icloud.com', 'me.com', 'live.com', 'aol.com', 'protonmail.com',
            'zoho.com', 'mail.com'
        ];

        // Ensure it's a common provider or at least not a niche/placeholder domain
        const isCommon = commonProviders.some(p => domain === p || domain.endsWith('.' + p));

        if (!isCommon && !domain.includes('.edu') && !domain.includes('.org')) {
            setError('Please use a valid email');
            return;
        }

        // Specifically block the one mentioned by user and previous placeholder
        if (domain === 'smail.com' || domain === 'future.me') {
            setError('Please use a valid email');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const data = await api.auth.register(email, password, name);
            if (data.status === 'success') {
                setSuccess(data.message || 'Account created successfully!');
                setTimeout(() => {
                    onRegisterSuccess(data.user);
                }, 1500);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            if (!success) setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center p-6">
            <div className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100 dark:border-stone-800 p-10 md:p-12 transition-colors duration-300">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-stone-100 dark:ring-stone-700">
                            <span className="text-3xl">✍️</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 tracking-tight">Create Account</h2>
                        <p className="text-stone-400 dark:text-stone-500 mt-2 font-medium tracking-tight">Begin your journey of reflection</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.15em] mb-2 px-1 transition-colors group-focus-within:text-stone-600 dark:group-focus-within:text-stone-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-6 py-4 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 focus:border-stone-200 dark:focus:border-stone-700 outline-none transition-all duration-300 text-stone-700 dark:text-stone-200 placeholder:text-stone-300 dark:placeholder:text-stone-600"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.15em] mb-2 px-1 transition-colors group-focus-within:text-stone-600 dark:group-focus-within:text-stone-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 focus:border-stone-200 dark:focus:border-stone-700 outline-none transition-all duration-300 text-stone-700 dark:text-stone-200 placeholder:text-stone-300 dark:placeholder:text-stone-600"
                                placeholder="you@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.15em] mb-2 px-1 transition-colors group-focus-within:text-stone-600 dark:group-focus-within:text-stone-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-6 py-4 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 focus:border-stone-200 dark:focus:border-stone-700 outline-none transition-all duration-300 text-stone-700 dark:text-stone-200 placeholder:text-stone-300 dark:placeholder:text-stone-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.15em] mb-2 px-1 transition-colors group-focus-within:text-stone-600 dark:group-focus-within:text-stone-300">
                                    Confirm
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-6 py-4 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 focus:border-stone-200 dark:focus:border-stone-700 outline-none transition-all duration-300 text-stone-700 dark:text-stone-200 placeholder:text-stone-300 dark:placeholder:text-stone-600"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50/50 dark:bg-red-900/10 text-red-500 dark:text-red-400 text-xs font-medium rounded-xl border border-red-100/50 dark:border-red-900/20 animate-in fade-in zoom-in-95">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-xl border border-emerald-100/50 dark:border-emerald-900/20 animate-in fade-in zoom-in-95">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4.5 bg-stone-800 dark:bg-stone-100 hover:bg-stone-900 dark:hover:bg-white text-white dark:text-stone-950 font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] dark:shadow-none hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-stone-950/30 dark:border-t-stone-950 rounded-full animate-spin"></span>
                                    Creating...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-stone-100/80 dark:border-stone-800 text-center">
                        <p className="text-stone-400 dark:text-stone-500 text-sm font-medium">
                            Already have an account?{' '}
                            <button
                                onClick={onShowLogin}
                                className="text-stone-800 dark:text-stone-100 font-bold hover:text-stone-600 dark:hover:text-stone-300 transition-colors underline underline-offset-4 decoration-stone-200 dark:decoration-stone-800 hover:decoration-stone-400 dark:hover:decoration-stone-600"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer aesthetic text */}
                <p className="text-center mt-8 text-stone-300 dark:text-stone-600 text-[10px] uppercase tracking-[0.2em] font-bold">
                    Start speaking to your future
                </p>
            </div>
        </div>
    );
}

export default Register;
