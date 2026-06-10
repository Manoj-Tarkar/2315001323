function PriorityPage() {
    const priorityNotifications = [
        {
            id: 1,
            type: "Placement",
            message: "TCS Hiring Drive"
        },
        {
            id: 2,
            type: "Placement",
            message: "AMD Hiring"
        },
        {
            id: 3,
            type: "Result",
            message: "Mid Sem Result Published"
        }
    ];

    return (
        <div>
            <h1>Priority Notifications</h1>

            {priorityNotifications.map((item) => (
                <div key={item.id} className="notification-card">
                    <h3>{item.type}</h3>
                    <p>{item.message}</p>
                </div>
            ))}
        </div>
    );
}

export default PriorityPage;