import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
function NotificationsProvider() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/job-seeker/login");
            return;
        }

        try {
            const response = await axios.get(
                'http://localhost:3001/notifications/getNotifications',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (Array.isArray(response.data)) {
                setNotifications(response.data);
                setError(false);
            } else {
                console.error('Invalid notifications data:', response.data);
                setNotifications([]);
                setError(true);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError(true);
        }
    }, [navigate]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <div style={{ padding: '20px' }}>
            <div
  style={{
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    backgroundColor: '#f8f9fa',
    paddingBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}
>
  {/* Header Section */}
  <div style={{ width: '100%' }}>
    <Menu />
  </div>
  </div>
            <h1>Notifications</h1>
            {notifications.length === 0 ? (
                <p>{error ? 'Failed to load notifications. Please try again later.' : 'No notifications found.'}</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Notification</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification) => (
                            <tr key={notification.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {notification.notification_data}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {notification.notification_date}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {notification.notification_time}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {notification.viewed ? 'Viewed' : 'Unviewed'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default NotificationsProvider;
