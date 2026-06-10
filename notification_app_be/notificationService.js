const axios = require("axios");

async function fetchNotifications() {
    try {
        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/notifications",
            {
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYW5vai50YXJrYXJfY3MyM0BnbGEuYWMuaW4iLCJleHAiOjE3ODEwNzQ0NTQsImlhdCI6MTc4MTA3MzU1NCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY3MzA5ZDdkLTU0YTctNDBiNC1hZGI5LTAzNzQzNjIwOTc5MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hbm9qIHRhcmthciIsInN1YiI6ImI3YjhkZjI4LWI0OTItNDA5NS1iNTNiLTAyNjlmN2RkNzgyZSJ9LCJlbWFpbCI6Im1hbm9qLnRhcmthcl9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJtYW5vaiB0YXJrYXIiLCJyb2xsTm8iOiIyMzE1MDAxMzIzIiwiYWNjZXNzQ29kZSI6IlJQc2dZdCIsImNsaWVudElEIjoiYjdiOGRmMjgtYjQ5Mi00MDk1LWI1M2ItMDI2OWY3ZGQ3ODJlIiwiY2xpZW50U2VjcmV0IjoiaEZ1U3pjdWFqUlRRWnF4VSJ9.S5E5YrK4HdD4PcY-KfAm2GRTGhggikrHoXkmslDrSBk"
                }
            }
        );

        console.log("FULL RESPONSE:");
        console.log(JSON.stringify(response.data, null, 2));

        return response.data.notifications || [];
    } catch (error) {
        console.log("ERROR:");
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.message);
        return [];
    }
}

module.exports = { fetchNotifications };