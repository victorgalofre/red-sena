import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationSettings from '../components/notifications/NotificationSettings';

const NotificationSettingsPage = () => {
    const { user } = useAuth();

    return (
        <NotificationSettings />
    );
};

export default NotificationSettingsPage;
