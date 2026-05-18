# AlumniConnect - Java Backend API Documentation

This document describes the REST API endpoints that your Java Spring Boot backend needs to implement to fully integrate with this Next.js frontend.

## Base Configuration

In `lib/api.ts`, set:
```typescript
const USE_MOCK_DATA = false
const API_BASE_URL = "http://localhost:8080/api" // Your Java backend URL
```

## Authentication Endpoints

### POST /api/auth/login
Login user with credentials.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ALUMNI", // ADMIN | ALUMNI | STUDENT
    "avatar": "url",
    "graduationYear": 2018,
    "degree": "Bachelor of Science",
    "major": "Computer Science",
    "currentCompany": "Google",
    "currentPosition": "Software Engineer",
    "location": "San Francisco, CA",
    "bio": "string",
    "linkedinUrl": "url",
    "skills": ["JavaScript", "Python"],
    "isMentor": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "ALUMNI", // ALUMNI | STUDENT
  "graduationYear": 2018,
  "degree": "string",
  "major": "string"
}
```

### POST /api/auth/logout
Logout current user.

### GET /api/auth/me
Get current authenticated user profile.

---

## Users Endpoints

### GET /api/users
Get all users (admin only).

**Query Parameters:**
- `role` (optional): Filter by role (ADMIN, ALUMNI, STUDENT)
- `page` (optional): Page number
- `size` (optional): Page size

### GET /api/users/:id
Get user by ID.

### PUT /api/users/:id
Update user profile.

### DELETE /api/users/:id
Delete user (admin only).

### GET /api/users/mentors
Get all users who are mentors.

---

## Jobs Endpoints

### GET /api/jobs
Get all jobs.

**Query Parameters:**
- `type` (optional): FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE
- `page` (optional): Page number
- `size` (optional): Page size

### GET /api/jobs/:id
Get job by ID.

### POST /api/jobs
Create new job posting.

**Request Body:**
```json
{
  "title": "string",
  "company": "string",
  "location": "string",
  "type": "FULL_TIME",
  "description": "string",
  "requirements": "string",
  "salaryMin": 50000,
  "salaryMax": 80000,
  "applicationDeadline": "2024-12-31"
}
```

### PUT /api/jobs/:id
Update job posting.

### DELETE /api/jobs/:id
Delete job posting.

### POST /api/jobs/:id/apply
Apply for a job.

**Request Body:**
```json
{
  "resumeUrl": "string",
  "coverLetter": "string"
}
```

---

## Events Endpoints

### GET /api/events
Get all events.

### GET /api/events/:id
Get event by ID.

### POST /api/events
Create new event (admin only).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "eventType": "NETWORKING", // NETWORKING, WORKSHOP, SEMINAR, REUNION, CAREER_FAIR, WEBINAR, OTHER
  "startDate": "2024-06-15T18:00:00Z",
  "endDate": "2024-06-15T22:00:00Z",
  "location": "string",
  "isVirtual": false,
  "virtualLink": "string",
  "maxAttendees": 100
}
```

### PUT /api/events/:id
Update event.

### DELETE /api/events/:id
Delete event.

### POST /api/events/:id/register
Register for an event.

### DELETE /api/events/:id/register
Unregister from an event.

---

## Mentorship Endpoints

### GET /api/mentorship/requests
Get mentorship requests for current user.

### POST /api/mentorship/requests
Create mentorship request.

**Request Body:**
```json
{
  "mentorId": 1,
  "message": "string",
  "topics": ["Career Advice", "Technical Skills"]
}
```

### PUT /api/mentorship/requests/:id
Update mentorship request status.

**Request Body:**
```json
{
  "status": "ACCEPTED" // PENDING, ACCEPTED, REJECTED, COMPLETED
}
```

---

## Messages Endpoints

### GET /api/conversations
Get all conversations for current user.

### GET /api/conversations/:id/messages
Get messages in a conversation.

### POST /api/conversations/:id/messages
Send a message.

**Request Body:**
```json
{
  "content": "string"
}
```

### POST /api/conversations
Start new conversation.

**Request Body:**
```json
{
  "participantId": 1
}
```

---

## Notifications Endpoints

### GET /api/notifications
Get notifications for current user.

### PUT /api/notifications/:id/read
Mark notification as read.

### PUT /api/notifications/read-all
Mark all notifications as read.

---

## Statistics Endpoints (Admin)

### GET /api/admin/stats
Get dashboard statistics.

**Response:**
```json
{
  "totalUsers": 100,
  "totalAlumni": 60,
  "totalStudents": 35,
  "totalJobs": 25,
  "totalEvents": 10,
  "activeJobs": 20,
  "upcomingEvents": 5,
  "newUsersThisMonth": 15
}
```

---

## Java Spring Boot Entity Classes

See `backend/database/schema.sql` for the complete MySQL schema.

### Required Dependencies (pom.xml):
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### application.properties:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/alumniconnect
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
jwt.secret=your-jwt-secret-key
jwt.expiration=86400000
```

---

## CORS Configuration

Your Java backend needs to allow CORS from the frontend:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```
