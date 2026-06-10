import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
    };

    return (
        <div>
            <h1>All Notifications</h1>

            {notifications.map((item) => (
                <div key={item.ID} className="notification-card">
                    <h3>{item.Type}</h3>
                    <p>{item.Message}</p>
                    <small>{item.Timestamp}</small>
                </div>
            ))}
        </div>
    );
}

export default NotificationsPage;   