export const isLetterUnlocked = (openDate) => {
    if (!openDate) return true;
    return new Date() >= new Date(openDate);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
}

export const getTimeDifference = (targetDate) => {
    if (!targetDate) return '';
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;

    if (diffTime <= 0) return 'Ready to open';

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
};
