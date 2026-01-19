import { useState, useEffect } from 'react';

function ResetPassword({ onLogin, token, email }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost/Letters-From-The-past/backend/api/auth/reset_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    token: token,
                    new_password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.message || 'Updated password failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full animation-fade-in-up">
                <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ✅
                    </div>
                    <h2 className="text-2xl font-serif text-stone-800 dark:text-white mb-2">Password Reset!</h2>
                    <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
                        Your password has been successfully updated. You can now login with your new credentials.
                    </p>
                    <button
                        onClick={onLogin}
                        className="w-full py-3.5 px-4 bg-stone-800 hover:bg-stone-900 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl font-medium transition-all transform active:scale-[0.98]"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animation-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-stone-800 dark:text-white mb-2">Reset Password</h2>
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Create a new strong password for your account.
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all text-stone-800 dark:text-stone-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all text-stone-800 dark:text-stone-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-stone-800 hover:bg-stone-900 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl font-medium transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Reseting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
