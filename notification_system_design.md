# Notification System Design

## Stage 1

### Objective

The goal of this system is to help students receive important updates related to placements, results and events. Students should be able to view notifications, track whether they have read them and filter notifications based on category. New notifications should also reach users instantly without requiring a page refresh.

### Main Features

The system should support:

1. Create a notification
2. View all notifications
3. View a notification by ID
4. Mark a notification as read
5. View unread notifications
6. Filter notifications by type
7. Receive notifications in real time

### Notification Categories

* Placement
* Result
* Event

### API Design

#### Create Notification

**POST** `/api/notifications`

Request:

```json
{
  "userId": "123",
  "type": "Placement",
  "message": "TCS hiring drive is now open"
}
```

Response:

```json
{
  "id": "n101",
  "message": "Notification created successfully"
}
```

#### Get All Notifications

**GET** `/api/notifications`

Response:

```json
[
  {
    "id": "n101",
    "type": "Placement",
    "message": "TCS hiring drive is now open",
    "isRead": false
  }
]
```

#### Get Notification By ID

**GET** `/api/notifications/{id}`

Response:

```json
{
  "id": "n101",
  "type": "Placement",
  "message": "TCS hiring drive is now open",
  "isRead": false
}
```

#### Mark Notification As Read

**PATCH** `/api/notifications/{id}/read`

Response:

```json
{
  "message": "Notification marked as read"
}
```

#### Get Unread Notifications

**GET** `/api/notifications/unread`

#### Filter Notifications

**GET** `/api/notifications?type=Placement`

**GET** `/api/notifications?type=Result`

**GET** `/api/notifications?type=Event`

### Notification Structure

```json
{
  "id": "n101",
  "userId": "123",
  "type": "Placement",
  "message": "TCS hiring drive is now open",
  "isRead": false,
  "createdAt": "2026-06-10T10:00:00Z"
}
```

### Real-Time Notifications

To deliver notifications instantly, WebSocket can be used. Whenever a new notification is created, connected users can receive it immediately without refreshing the application.

### Assumptions

* Every notification belongs to a single student.
* A notification can be marked as read only once.
* Notifications are stored for future reference.
* Students can filter notifications by category.
* Real-time updates are required for important announcements.

### Summary

This design provides simple APIs for creating and managing notifications. Notifications are grouped into Placement, Result and Event categories. Real-time delivery helps users receive updates quickly, while filtering and read tracking improve the overall user experience.


## Stage 2

### Database Choice

For this system, a relational database is a suitable option because notifications have a clear structure and relationships with users. It also supports indexing and querying efficiently when the amount of data grows.

### Main Tables

#### Users

| Column     | Type      |
| ---------- | --------- |
| id         | BIGINT    |
| name       | VARCHAR   |
| email      | VARCHAR   |
| created_at | TIMESTAMP |

#### Notifications

| Column     | Type      |
| ---------- | --------- |
| id         | BIGINT    |
| user_id    | BIGINT    |
| type       | VARCHAR   |
| message    | TEXT      |
| is_read    | BOOLEAN   |
| created_at | TIMESTAMP |

### Relationship

* One user can receive many notifications.
* Each notification belongs to one user.

### Indexing

Frequently searched fields can be indexed to improve query performance.

Possible indexed fields:

* user_id
* type
* is_read
* created_at

Example:

```sql
CREATE INDEX idx_user_notifications
ON notifications(user_id);

CREATE INDEX idx_notification_type
ON notifications(type);
```

### Possible Challenges

As the number of students and notifications increases, the notifications table may grow significantly. This can increase query time and storage requirements.

### Handling Growth

Some approaches that can help:

* Use indexes on commonly searched fields.
* Load notifications in smaller batches.
* Move very old notifications to archive storage.
* Split large datasets based on time ranges.
* Use caching for frequently accessed data.

### Example Queries

Get notifications for a user:

```sql
SELECT *
FROM notifications
WHERE user_id = 123
ORDER BY created_at DESC;
```

Get unread notifications:

```sql
SELECT *
FROM notifications
WHERE user_id = 123
AND is_read = false;
```

Get placement notifications:

```sql
SELECT *
FROM notifications
WHERE type = 'Placement';
```

### Summary

The database design keeps notification data organized and easy to query. Proper indexing and data management techniques can help maintain good performance as the number of users increases.

## Stage 3

### Query Analysis

Given Query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is The Query Correct?

Yes, the query is correct. It returns unread notifications for a particular student and sorts them based on the time they were created.

### Why Can It Become Slow?

When the notifications table contains a very large number of records, the database may need to examine many rows before finding the required data.

Some possible reasons are:

* Large amount of notification data
* Missing indexes
* Sorting a large number of records

### Suggested Improvement

A composite index can be created on the columns used for filtering and sorting.

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

This helps the database locate matching records faster and reduces the amount of work required for sorting.

### Expected Impact

Without proper indexing, the database may scan a large part of the table before returning results.

With the suggested index, query execution becomes much faster because the required records can be located more efficiently.

### Should Every Column Be Indexed?

No.

Adding indexes on every column is usually not a good idea because:

* Extra storage space is required.
* Insert and update operations become slower.
* Some indexes may never be used.

Indexes should mainly be created on columns that are frequently used in filtering, sorting or joining data.

### Students Who Received Placement Notifications In The Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= CURRENT_DATE - INTERVAL '7 days';
```

### Summary

The query works correctly, but performance can decrease as the amount of data grows. Proper indexing helps reduce search time and improves overall database performance.

## Stage 4

### Problem Statement

If the application fetches notifications from the database every time a user opens the page, the database load can increase significantly as the number of users grows.

This may result in:

* Slower response times
* Increased database workload
* Poor user experience during peak usage

### Proposed Improvements

#### 1. Pagination

Instead of returning all notifications at once, the system should return a limited number of records per request.

Benefits:

* Faster page loading
* Lower database load
* Better handling of large datasets

#### 2. Caching

Frequently accessed notifications can be stored in a cache such as Redis.

Benefits:

* Faster response time
* Fewer database queries
* Reduced server load

#### 3. Real-Time Updates

WebSockets can be used to push notifications directly to users when new updates are available.

Benefits:

* Users receive updates instantly
* Less frequent polling requests
* Improved user experience

#### 4. Read Replicas

Read operations can be distributed across replica databases while write operations continue on the primary database.

Benefits:

* Better scalability
* Reduced pressure on the main database
* Improved performance during heavy traffic

### Trade-Offs

| Solution      | Advantages                              | Disadvantages                        |
| ------------- | --------------------------------------- | ------------------------------------ |
| Pagination    | Reduces database load and network usage | Multiple requests may be required    |
| Caching       | Faster data access                      | Cache management adds complexity     |
| WebSocket     | Real-time notifications                 | More connection management is needed |
| Read Replicas | Improves read performance               | Data synchronization delay may occur |

### Recommended Approach

For a large-scale notification system, a combination of pagination, caching, WebSockets and read replicas can be used. Together, these techniques help improve performance and provide a better experience for users.

### Summary

As the system grows, database performance becomes an important concern. Using pagination, caching and scalable database strategies can help maintain fast and reliable notification delivery.


## Stage 5

### Existing Approach

Current Flow:

```text
HR → API → Database → Email Service
```

This approach is simple and works well when the number of notifications is small. However, during placement season or major announcements, thousands of notifications may be generated at the same time.

### Problems With The Current Approach

* High load on the API server
* Slower notification delivery
* Email service failures can affect the entire process
* Difficult to handle a large number of notifications at once

### Improved Architecture

Proposed Flow:

```text
HR
↓
Notification API
↓
Message Queue
↓
Worker Service
↓
Database
↓
Email / Push Notification Service
```

### Why Use A Message Queue?

A message queue helps separate notification creation from notification delivery.

Benefits:

* Better scalability
* More reliable processing
* Retry support for failed messages
* Reduced load on the main application

Some commonly used message queue systems are:

* RabbitMQ
* Apache Kafka
* Amazon SQS

### Failure Handling

If notification delivery fails:

1. The message remains in the queue.
2. The worker retries processing.
3. Multiple retry attempts can be configured.
4. Failed messages can be moved to a Dead Letter Queue (DLQ) for later inspection.

### Revised Process

```text
Receive Notification Request

Validate Request

Store Notification Data

Publish Message To Queue

Worker Reads Message

Send Notification

If Delivery Fails:
    Retry

If Retry Limit Reached:
    Move To Dead Letter Queue
```

### Advantages Of The New Design

* Can handle a large number of notifications
* Better fault tolerance
* Easier to scale during peak usage
* More reliable notification delivery

### Summary

Using a queue-based architecture makes the notification system more scalable and reliable. It allows the application to handle heavy traffic efficiently while ensuring notifications are delivered even if temporary failures occur.
