# WebSocket Notification System Explained 🔔

## What is WebSocket?

WebSocket is a **real-time, two-way communication** protocol between your browser and server. Unlike regular HTTP requests, WebSocket keeps a persistent connection open, allowing the server to **push notifications instantly** to users without them refreshing the page.

## How Your Notification System Works

### Architecture Overview

```
User Browser                    Spring Boot Server
    |                                  |
    |------ WebSocket Connect -------->|
    |<----- Connection Accepted --------|
    |                                  |
    |  [User subscribes to their queue]|
    |                                  |
    |                                  | [Event happens]
    |                                  | (appointment booked,
    |                                  |  payment received, etc.)
    |                                  |
    |<----- Push Notification ---------|
    |                                  |
    [Toast appears on screen!]         |
```

## When Notifications Are Sent

Your system sends notifications for these events:

### 1. **Appointment Events**
```java
// When appointment is booked
notificationService.sendNotification(
    patientId,
    "Appointment Confirmed",
    "Your appointment with Dr. Smith on Oct 24 at 10:00 AM is confirmed",
    "APPOINTMENT"
);

// When appointment is cancelled
notificationService.sendNotification(
    patientId,
    "Appointment Cancelled",
    "Your appointment has been cancelled",
    "APPOINTMENT"
);
```

### 2. **Payment Events**
```java
// When payment is successful
notificationService.sendNotification(
    userId,
    "Payment Successful",
    "Your payment of $50 has been processed",
    "PAYMENT"
);
```

### 3. **Reminder Events**
```java
// Appointment reminder (24 hours before)
notificationService.sendNotification(
    patientId,
    "Appointment Reminder",
    "You have an appointment tomorrow at 10:00 AM",
    "REMINDER"
);
```

### 4. **System Events**
```java
// System announcements
notificationService.sendNotification(
    userId,
    "System Maintenance",
    "Scheduled maintenance on Sunday 2 AM - 4 AM",
    "SYSTEM"
);
```

## How It Works (Step by Step)

### Step 1: User Logs In
```javascript
// notification_handler.js
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// Connect to WebSocket
connectWebSocket(userId, token);
```

### Step 2: WebSocket Connection Established
```javascript
const socket = new SockJS('/ws');  // Connect to /ws endpoint
stompClient = Stomp.over(socket);  // Use STOMP protocol

stompClient.connect(headers, function (frame) {
    console.log('Connected to WebSocket');
    
    // Subscribe to user-specific queue
    stompClient.subscribe(`/user/${userId}/queue/notifications`, function (message) {
        const notification = JSON.parse(message.body);
        showToast(notification);  // Show popup!
    });
});
```

### Step 3: Server Sends Notification
```java
// NotificationService.java
messagingTemplate.convertAndSendToUser(
    userId.toString(),
    "/queue/notifications",
    notificationDTO
);
```

### Step 4: Browser Receives & Displays
```javascript
// Toast notification appears!
showToast({
    title: "Appointment Confirmed",
    message: "Your appointment is booked",
    type: "APPOINTMENT"
});
```

## What You See

### Toast Notification (Popup)
```
┌─────────────────────────────────┐
│ 🔔 Appointment Confirmed        │
│ Your appointment with Dr. Smith │
│ on Oct 24 at 10:00 AM           │
│                      Just now   │
└─────────────────────────────────┘
```

### Notification Badge
```
🔔 (3)  ← Red badge showing 3 unread notifications
```

## Notification Types & Colors

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| **APPOINTMENT** | Green | 📅 | Bookings, cancellations |
| **PAYMENT** | Purple | 💳 | Payment confirmations |
| **REMINDER** | Pink | ⏰ | Upcoming appointments |
| **INFO** | Blue | ℹ️ | General information |
| **WARNING** | Orange | ⚠️ | Important alerts |
| **SYSTEM** | Gray | ⚙️ | System messages |

## Where Notifications Appear

### 1. **Toast Popups** (Top-right corner)
- Appears automatically
- Auto-dismisses after 5 seconds
- Click to dismiss manually

### 2. **Notification Badge** (Navbar)
- Shows unread count
- Updates in real-time
- Bounces when new notification arrives

### 3. **Notification List** (Dashboard)
- Full history of notifications
- Mark as read/unread
- Click to view details

## Example Scenarios

### Scenario 1: Patient Books Appointment
```
1. Patient clicks "Book Appointment"
2. Backend creates appointment
3. Backend sends notification:
   notificationService.sendNotification(
       patientId,
       "Appointment Confirmed",
       "Your appointment is booked for Oct 24",
       "APPOINTMENT"
   )
4. WebSocket pushes to patient's browser
5. Toast appears: "🔔 Appointment Confirmed"
6. Badge updates: 🔔 (1)
```

### Scenario 2: Doctor Cancels Appointment
```
1. Doctor cancels appointment
2. Backend updates appointment status
3. Backend sends notification to patient:
   notificationService.sendNotification(
       patientId,
       "Appointment Cancelled",
       "Dr. Smith cancelled your appointment",
       "APPOINTMENT"
   )
4. Patient sees toast immediately (if online)
5. Or sees notification when they login next
```

### Scenario 3: Payment Processed
```
1. Patient completes payment
2. Payment service processes transaction
3. Backend sends notification:
   notificationService.sendNotification(
       patientId,
       "Payment Successful",
       "Your payment of $50 has been processed",
       "PAYMENT"
   )
4. Toast appears with purple border
5. Badge increments
```

## API Endpoints

### Get User Notifications
```
GET /api/notifications/user/{userId}
Response: List of all notifications
```

### Get Unread Count
```
GET /api/notifications/user/{userId}/unread-count
Response: { "count": 3 }
```

### Mark as Read
```
POST /api/notifications/{notificationId}/read?userId={userId}
```

### Mark All as Read
```
POST /api/notifications/user/{userId}/read-all
```

## WebSocket Configuration

### Backend (WebSocketConfig.java)
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                .withSockJS();
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue", "/topic");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }
}
```

### Frontend (notification_handler.js)
```javascript
// Included in all dashboard pages
<script src="/js/notification_handler.js"></script>
```

## Benefits of WebSocket Notifications

✅ **Instant** - No page refresh needed
✅ **Real-time** - Updates appear immediately
✅ **Efficient** - One persistent connection
✅ **User-specific** - Each user gets their own notifications
✅ **Reliable** - Auto-reconnects if connection drops

## Testing Notifications

### Manual Test (Using API)
```bash
# Send a test notification
curl -X POST http://localhost:8080/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": 1,
    "title": "Test Notification",
    "message": "This is a test",
    "type": "INFO"
  }'
```

### Automatic Triggers
Notifications are automatically sent when:
- ✅ Appointment is booked
- ✅ Appointment is cancelled
- ✅ Payment is processed
- ✅ Prescription is created
- ✅ Medical record is updated
- ✅ System announcements

## Troubleshooting

### No notifications appearing?
1. Check if WebSocket is connected (browser console)
2. Verify userId is stored in localStorage
3. Check if notification_handler.js is loaded
4. Look for WebSocket errors in console

### Badge not updating?
1. Check if `.notification-badge` element exists
2. Verify unread count API is working
3. Check browser console for errors

### Connection keeps dropping?
1. Check server logs for WebSocket errors
2. Verify CORS settings
3. Check firewall/proxy settings

## Future Enhancements

Possible improvements:
- Push notifications (browser notifications)
- Email notifications
- SMS notifications
- Notification preferences
- Notification history
- Notification categories
- Sound alerts
- Desktop notifications

---

**Your notification system is working!** The WebSocket logs you saw are normal and show healthy connections. 🎉
