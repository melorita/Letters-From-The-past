import { useState, useRef } from 'react';
import { api } from '../services/api';

function Profile({ user, onUpdate, onLogout, onBack }) {
    const [name, setName] = useState(user.name || '');
    const [profilePic, setProfilePic] = useState(user.profile_pic || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

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
                setMessage({ type: 'success', text: 'Photo uploaded! Don\'t forget to save changes.' });
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
        setMessage({ type: '', text: '' });

        try {
            const data = await api.auth.updateProfile({
                id: user.id,
                name,
                profile_pic: profilePic
            });

            if (data.status === 'success') {
                onUpdate(data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 p-8 md:p-12">
                <div className="flex items-center justify-between mb-10">
                    <button
                        onClick={onBack}
                        className="p-3 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors group"
                    >
                        <span className="text-xl group-hover:-translate-x-1 transition-transform inline-block">←</span>
                    </button>
                    <h2 className="text-3xl font-serif font-bold text-stone-800">Your Profile</h2>
                    <div className="w-10 h-10"></div> {/* Spacer for symmetry */}
                </div>

                <div className="flex flex-col items-center mb-10">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-white border border-stone-100 overflow-hidden relative">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl opacity-30">👤</span>
                            )}

                            {/* Overlay Loading State */}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-4 right-0 bg-stone-800 text-white p-2 rounded-full hover:bg-stone-900 transition-colors shadow-lg hover:scale-110 active:scale-95 duration-200"
                            title="Change Photo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <p className="text-stone-400 font-medium text-sm uppercase tracking-widest mt-2">{user.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-[0.15em] mb-2 px-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-stone-100 focus:border-stone-200 outline-none transition-all duration-300 text-stone-700 placeholder:text-stone-300"
                            placeholder="How should we call you?"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl text-xs font-medium border animate-in fade-in zoom-in-95 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4 space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-stone-200 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-full py-4.5 bg-white border border-stone-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all duration-300"
                        >
                            Sign Out
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
