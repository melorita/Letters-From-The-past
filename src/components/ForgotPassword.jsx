import { useState } from 'react';
import { api } from '../services/api';

function ForgotPassword({ onBack, onEmailSent }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://localhost/Letters-From-The-past/backend/api/auth/forgot_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                if (onEmailSent) onEmailSent();
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed into connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animation-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-stone-800 dark:text-white mb-2">Forgot Password?</h2>
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Enter your email and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 p-8">
                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            ✉️
                        </div>
                        <h3 className="text-lg font-medium text-stone-800 dark:text-white mb-2">Check your email</h3>
                        <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
                            If an account exists for <strong>{email}</strong>, we've sent a password reset link.
                        </p>
                        <button
                            onClick={onBack}
                            className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-sm font-medium transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all text-stone-800 dark:text-stone-200 placeholder-stone-400"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-stone-800 hover:bg-stone-900 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl font-medium transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-sm font-medium transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
