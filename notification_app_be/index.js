console.log("Program Started");

const Log = require("../logging_middleware");
const { fetchNotifications } = require("./notificationService");

function calculatePriority(notification) {
    let score = 0;

    switch (notification.Type) {
        case "Placement":
            score += 30;
            break;
        case "Result":
            score += 20;
            break;
        default:
            score += 10;
    }

    const notificationTime = new Date(notification.Timestamp).getTime();
    const currentTime = Date.now();

    const minutesOld = (currentTime - notificationTime) / (1000 * 60);

    score += Math.max(0, 100 - minutesOld);

    return score;
}

async function main() {
    try {
        const notifications = await fetchNotifications();

        const rankedNotifications = notifications
            .map((notification) => ({
                ...notification,
                priority: calculatePriority(notification)
            }))
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 10);

        console.log("\nTop 10 Priority Notifications\n");

        rankedNotifications.forEach((notification, index) => {
            console.log(
                `${index + 1}. ${notification.Type} | ${notification.Message} | Priority: ${notification.priority.toFixed(2)}`
            );
        });
    } catch (error) {
        console.log(error.message);
    }
}

main();