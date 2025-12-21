import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

function Profile({ user, onUpdate, onLogout, onBack }) {
    const [name, setName] = useState(user.name || '');
    const [profilePic, setProfilePic] = useState(user.profile_pic || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    // Visibility toggles
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);
    const messageRef = useRef(null);

    // Auto-scroll to message when it appears
    useEffect(() => {
        if (message.text && messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [message.text]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const data = await api.auth.uploadAvatar(formData);
            if (data.status === 'success') {
                setProfilePic(data.url);
                setMessage({ type: 'success', text: 'Photo uploaded!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Upload failed' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: 'info', text: 'Processing your request...' });

        try {
            // 1. Update Profile (Name/Pic)
            const profileData = await api.auth.updateProfile({
                id: user.id,
                name,
                profile_pic: profilePic
            });

            if (profileData.status !== 'success') {
                setMessage({ type: 'error', text: profileData.message || 'Failed to update profile' });
                setLoading(false);
                return;
            }

            let isPasswordChanged = false;

            // 2. Optional: Change Password
            if (isEditingPassword && currentPassword && newPassword) {
                if (currentPassword === newPassword) {
                    setMessage({ type: 'error', text: 'New password cannot be the same as current password.' });
                    setLoading(false);
                    return;
                }
                if (newPassword !== confirmNewPassword) {
                    setMessage({ type: 'error', text: 'New passwords do not match.' });
                    setLoading(false);
                    return;
                }
                const passData = await api.auth.changePassword(user.id, currentPassword, newPassword);
                if (passData.status !== 'success') {
                    setMessage({ type: 'error', text: passData.message || 'Failed to update password' });
                    setLoading(false);
                    return;
                }
                // Reset password fields on success
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setIsEditingPassword(false);
                isPasswordChanged = true;
            }

            onUpdate(profileData.user);
            setMessage({
                type: 'success',
                text: isPasswordChanged ? 'You have successfully changed your password!' : 'Changes saved successfully!'
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const PasswordToggle = ({ visible, onToggle }) => (
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
        >
            {visible ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
        </button>
    );

    return (
        <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800 p-8 md:p-10 transition-colors duration-300">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBack} className="p-3 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors">
                        <span className="text-xl dark:text-stone-300">←</span>
                    </button>
                    <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100">Settings</h2>
                    <div className="w-10"></div>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center shadow-inner ring-4 ring-white dark:ring-stone-900 border border-stone-100 dark:border-stone-800 overflow-hidden relative transition-all">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl opacity-30 dark:opacity-50">👤</span>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-950 p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                    <p className="text-stone-400 dark:text-stone-500 font-medium text-[10px] uppercase tracking-widest mt-3">{user.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5 px-1">Name</label>
                            <input
                                type="text"
                                className="w-full px-5 py-3.5 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 outline-none transition-all text-stone-700 dark:text-stone-200 text-sm"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {!isEditingPassword ? (
                            <button
                                type="button"
                                onClick={() => setIsEditingPassword(true)}
                                className="text-[11px] font-bold text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 uppercase tracking-widest px-1 flex items-center gap-2 transition-colors mt-2"
                            >
                                🔒 Change Password?
                            </button>
                        ) : (
                            <div className="space-y-4 pt-4 border-t border-stone-50 dark:border-stone-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-end px-1">
                                    <button type="button" onClick={() => setIsEditingPassword(false)} className="text-[10px] text-red-400 font-bold uppercase tracking-widest hover:text-red-500">Cancel</button>
                                </div>

                                <div className="relative group">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        className="w-full px-5 py-3.5 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 outline-none transition-all text-stone-700 dark:text-stone-200 text-sm pr-12"
                                        placeholder="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                    <PasswordToggle visible={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            className="w-full px-5 py-3.5 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 outline-none transition-all text-stone-700 dark:text-stone-200 text-sm pr-11"
                                            placeholder="New"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <PasswordToggle visible={showNew} onToggle={() => setShowNew(!showNew)} />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            className="w-full px-5 py-3.5 bg-stone-50/50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl focus:bg-white dark:focus:bg-stone-800 focus:ring-4 focus:ring-stone-100 dark:focus:ring-stone-800 outline-none transition-all text-stone-700 dark:text-stone-200 text-sm pr-11"
                                            placeholder="Confirm"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            required
                                        />
                                        <PasswordToggle visible={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 space-y-4">
                        {message.text && (
                            <div ref={messageRef} className={`p-4 rounded-2xl text-sm font-medium border shadow-sm animate-in fade-in zoom-in-95 duration-300 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20' :
                                message.type === 'info' ? 'bg-stone-50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 animate-pulse' :
                                    'bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/20'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <span>{message.type === 'success' ? '✅' : message.type === 'info' ? '⏳' : '❌'}</span>
                                    {message.text}
                                </div>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-stone-800 dark:bg-stone-100 hover:bg-stone-900 dark:hover:bg-white text-white dark:text-stone-950 font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onLogout}
                                className="text-[11px] text-stone-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors py-2"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
