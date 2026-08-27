# 🩸 BloodLink

### Intelligent Emergency Blood Donor Matching Platform

BloodLink is a full-stack emergency blood donation platform designed to connect patients and hospitals with eligible blood donors based on blood-group compatibility, geographic proximity, donor availability, donation history, reliability, and emergency priority.

The platform combines a React frontend with a Spring Boot backend, PostgreSQL persistence, JWT/OAuth2 authentication, and WebSocket-based real-time emergency notifications.

---

## 🎯 Problem

During an emergency blood requirement, finding a suitable donor quickly can be difficult.

A simple blood-group search is often not enough. A practical donor matching system should also consider:

- Blood-group compatibility
- Distance from the hospital
- Current donor availability
- Previous donation history
- Donor response reliability
- Emergency priority

BloodLink addresses this problem by first filtering eligible donors and then ranking them using an explainable multi-factor scoring algorithm.

---

# ✨ Features

## 🔐 Authentication & Security

- JWT-based authentication
- Google OAuth2 authentication
- Spring Security integration
- Role-based authorization
- Password encryption
- Protected REST APIs
- Custom JWT authentication filter
- Environment-based secret configuration

---

## 🩸 Emergency Blood Requests

Users can:

- Create blood requests
- Specify required blood group
- Specify required units
- Set request priority
- Associate requests with hospitals
- View pending requests
- Track request status
- Manage emergency requests

---

## 🧠 Intelligent Donor Matching

BloodLink uses an explainable multi-factor donor ranking algorithm.

The matching pipeline:

1. Determines the search radius based on request priority
2. Finds available donors within the geographic radius
3. Filters donors by blood-group compatibility
4. Applies the 90-day donation eligibility rule
5. Calculates a multi-factor matching score
6. Sorts donors by final score
7. Assigns ranks
8. Returns the top 10 matches

---

# 🧮 Donor Matching Algorithm

## 1. Dynamic Search Radius

The geographic search radius depends on emergency priority.

| Request Priority | Search Radius |
|------------------|---------------|
| CRITICAL | 10 km |
| HIGH | 25 km |
| NORMAL | 50 km |

Critical requests use a smaller search radius because nearby donors are more valuable when the situation is highly urgent.

---

## 2. Eligibility Filtering

Before ranking, donors must pass the eligibility checks.

### Blood Compatibility

The donor's blood group is checked against the blood group required by the blood request.

Incompatible donors are excluded before scoring.

### Donation Eligibility

A donor who donated blood less than 90 days ago is excluded.

```text
Days Since Last Donation >= 90
```

### Geographic Filtering

Only available donors within the priority-specific geographic radius are retrieved for matching.

---

# 📊 Matching Score

Each eligible donor receives a final matching score.

| Factor | Maximum Contribution |
|--------|----------------------|
| Blood Compatibility | 40 |
| Geographic Proximity | 25 |
| Availability | 15 |
| Donation History | 10 |
| Reliability | 10 |
| BloodLink Score | 10 |

### Final Score

```text
Final Score =
    Compatibility Score
  + Distance Score
  + Availability Score
  + Donation History Score
  + Reliability Score
  + (BloodLink Score × 0.10)
```

The final score is capped at `100`.

The BloodLink score is normalized to the range `0–100` before contributing to the final score.

---

# 📍 Distance Scoring

Distance is converted into a normalized score based on request priority.

```text
Distance Score =
    25 × (1 - distance / maximum search radius)
```

If the donor is at or beyond the maximum search radius:

```text
Distance Score = 0
```

This means closer eligible donors receive a higher geographic score.

### Example

For a `HIGH` priority request:

```text
Maximum Radius = 25 km

5 km  → 20 points
10 km → 15 points
20 km → 5 points
25 km → 0 points
```

---

# 🩸 Donation History Score

Successful previous donations contribute to the donor's score.

```text
Donation History Score =
    min(successful donations × 2, 10)
```

| Successful Donations | Score |
|----------------------|-------|
| 0 | 0 |
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |
| 5+ | 10 |

The score is capped at `10` so that donation count cannot dominate the other matching factors.

---

# 🤝 Reliability Score

Donor reliability is calculated from previous request responses.

```text
Acceptance Rate =
    Accepted Requests /
    (Accepted Requests + Rejected Requests)
```

Then:

```text
Reliability Score =
    Acceptance Rate × 10
```

For a donor without previous response history, a neutral score of `5` is assigned.

---

# 🏆 Donor Ranking

After calculating the final score, eligible donors are sorted in descending order.

```text
Highest Score
      ↓
    Rank 1
      ↓
    Rank 2
      ↓
    Rank 3
      ↓
     ...
      ↓
    Rank 10
```

Each `DonorMatch` stores information including:

- Donor
- Blood request
- Distance
- Compatibility score
- Availability score
- Donation history score
- Reliability score
- BloodLink score
- Final score
- Rank
- Notification status
- Acceptance status

---

# 🚨 Critical Emergency Flow

For `CRITICAL` blood requests, the system sends real-time emergency alerts to the top 10 ranked donors.

```text
Patient
   │
   ▼
Create Critical Blood Request
   │
   ▼
Find Eligible Donors
   │
   ▼
Calculate Matching Scores
   │
   ▼
Sort by Final Score
   │
   ▼
Top 10 Donors
   │
   ▼
WebSocket / STOMP
   │
   ▼
Real-Time Emergency Alert
   │
   ▼
Donor Accepts / Rejects
```

This allows urgent requests to reach suitable donors without depending only on periodic polling.

---

# ⚡ Real-Time Notification Architecture

BloodLink uses WebSocket/STOMP for real-time communication.

```text
┌──────────────────┐
│  React Frontend  │
└────────┬─────────┘
         │
         │ WebSocket
         ▼
┌──────────────────┐
│ Spring WebSocket │
│      Layer       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Notification    │
│     Service      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Matching Service │
└──────────────────┘
```

The real-time layer is responsible for delivering time-sensitive emergency notifications while REST APIs handle persistent application data.

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────────────┐
│                React Frontend               │
│                                             │
│   Pages │ Components │ Services │ Router    │
└──────────────────────┬──────────────────────┘
                       │
                 REST / WebSocket
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              Spring Boot Backend            │
│                                             │
│  Controllers                                │
│       ↓                                     │
│  Services                                   │
│       ↓                                     │
│  Repositories                               │
│       ↓                                     │
│  PostgreSQL                                 │
│                                             │
│  Security │ JWT │ OAuth2 │ WebSocket        │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
               ┌───────────────┐
               │  PostgreSQL   │
               └───────────────┘
```

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Java 17, Spring Boot |
| REST API | Spring Web |
| Security | Spring Security |
| Authentication | JWT, Google OAuth2 |
| ORM | Spring Data JPA, Hibernate |
| Database | PostgreSQL |
| Real-Time | WebSocket, STOMP |
| API Documentation | Swagger / OpenAPI |
| Testing | JUnit, Mockito, Spring Security Test |
| Build | Maven |
| Containerization | Docker, Docker Compose |
| HTTP Client | Axios |
| Version Control | Git, GitHub |

---

# 📁 Project Structure

```text
BLOOD-LINK--AI/
│
├── bloodlink-backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/bloodlink/bloodlink_backend/
│   │   │   │       │
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── exception/
│   │   │   │       ├── repo/
│   │   │   │       ├── security/
│   │   │   │       ├── service/
│   │   │   │       └── util/
│   │   │
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
└── frontend/
    │
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── main.jsx
    │
    ├── package.json
    └── vite.config.js
```

---

# 🔐 Authentication Architecture

```text
                 User
                  │
                  ▼
          Login / Register
                  │
                  ▼
          Spring Security
                  │
                  ▼
          Authentication
                  │
                  ▼
             JWT Token
                  │
                  ▼
       Authorization Header
                  │
                  ▼
        JwtAuthenticationFilter
                  │
                  ▼
        Validate JWT Signature
                  │
                  ▼
         Load User Details
                  │
                  ▼
       SecurityContextHolder
                  │
                  ▼
          Protected API
```

---

# 🌐 API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Blood Requests

```http
POST /api/blood-request
GET  /api/blood-request/pending
```

## Donors

```http
GET /api/donors/{userId}
```

## Matching

```http
GET /api/matching/eligible/{requestId}
```

> The API list can be expanded as additional endpoints are added.

---

# 📖 API Documentation

Swagger/OpenAPI is integrated into the backend.

When running the backend locally:

```text
http://localhost:8080/swagger-ui/index.html
```

Swagger provides an interactive interface for exploring and testing the available REST APIs.

---

# 🧪 Testing

The backend contains automated tests covering authentication, security, matching, notification services, patient services, and real-time functionality.

### Test Coverage Areas

```text
Authentication
    │
    ├── Registration
    ├── Login
    └── Security

Matching
    │
    ├── Donor Eligibility
    ├── Blood Compatibility
    ├── Ranking
    └── Real-Time Matching

Notifications
    │
    ├── Notification Service
    └── Real-Time Notifications

Patient Services
    │
    └── Service Layer
```

Run tests with Maven:

```bash
./mvnw test
```

On Windows:

```powershell
.\mvnw.cmd test
```

---

# 🐳 Docker

BloodLink supports containerized development using Docker Compose.

The application uses containers for the backend and PostgreSQL database.

## Start the application

```bash
docker compose up --build
```

## Stop containers

```bash
docker compose down
```

## Check running containers

```bash
docker compose ps
```

## View backend logs

```bash
docker compose logs backend
```

---

# ⚙️ Environment Configuration

Create a local `.env` file containing your environment-specific values:

```env
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=your_long_random_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Never commit real credentials, OAuth secrets, database passwords, or JWT secrets to GitHub.

Use `.env.example` as the public configuration template.

---

# 💻 Local Development

## Backend

Navigate to the backend:

```bash
cd bloodlink-backend
```

Run with Maven:

```bash
./mvnw spring-boot:run
```

### Windows

```powershell
.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧠 Engineering Decisions

## Why Spring Boot?

Spring Boot provides a mature ecosystem for building secure REST APIs, database-backed applications, validation, testing, and real-time communication.

The layered architecture separates:

- HTTP/API handling
- Business logic
- Persistence
- Security
- Data transfer

This makes the backend easier to maintain and test.

---

## Why PostgreSQL?

BloodLink contains relational data such as:

- Users
- Donors
- Patients
- Hospitals
- Blood Requests
- Donor Matches
- Notifications
- Donation Records

PostgreSQL provides relational consistency and integrates naturally with Spring Data JPA.

---

## Why JWT?

JWT allows authenticated API requests to carry the user's identity without requiring a traditional server-side session for every request.

The backend validates incoming JWT tokens through a custom authentication filter before protected endpoints are accessed.

---

## Why WebSocket?

Emergency blood requests are time-sensitive.

Polling the server repeatedly can introduce unnecessary requests and notification delays.

WebSocket/STOMP provides a persistent communication channel for delivering critical donor notifications in real time.

---

## Why Explainable Matching?

The matching algorithm is deterministic and explainable.

Instead of returning an unexplained recommendation, BloodLink calculates a score using identifiable factors:

```text
Blood Compatibility
        +
Distance
        +
Availability
        +
Donation History
        +
Reliability
        +
BloodLink Score
        ↓
   Final Score
        ↓
      Rank
```

This makes the system easier to:

- Test
- Debug
- Explain
- Tune
- Audit

---

# ⚡ Technical Challenge

## Real-Time Emergency Notifications

One of the key engineering challenges was delivering emergency requests to suitable donors without relying entirely on polling.

The solution separates persistent application state from time-sensitive communication.

```text
REST API
   │
   └── Persistent request and match data

WebSocket
   │
   └── Real-time emergency notifications
```

The matching service first identifies and ranks eligible donors. For critical requests, the top 10 ranked matches are then passed to the real-time notification service.

This architecture allows REST APIs to handle persistent application operations while WebSocket handles time-sensitive notification delivery.

---

# 🔍 Algorithm Complexity

Let:

```text
N = number of eligible donor candidates
```

### Eligibility Filtering

Each candidate donor is checked once:

```text
O(N)
```

### Score Calculation

Each eligible donor is scored once:

```text
O(N)
```

### Ranking

Donors are sorted by their final score:

```text
O(N log N)
```

### Overall Matching Complexity

The dominant in-memory operation is sorting:

```text
O(N log N)
```

The geographic donor lookup is performed by the database/repository layer, so its exact cost depends on the database query and indexing strategy.

---

# 📌 Project Status

| Area | Status |
|------|--------|
| React Frontend | ✅ |
| Spring Boot Backend | ✅ |
| PostgreSQL | ✅ |
| JWT Authentication | ✅ |
| Google OAuth2 | ✅ |
| Role-Based Security | ✅ |
| Blood Requests | ✅ |
| Donor Matching | ✅ |
| Donor Ranking | ✅ |
| WebSocket Notifications | ✅ |
| Swagger/OpenAPI | ✅ |
| Docker Compose | ✅ |
| Automated Tests | ✅ |
| Environment Configuration | ✅ |

---

# 📸 Screenshots

Add screenshots of the actual application here.

Recommended screenshots:

### Login

_Add Login Screenshot Here_

### Donor Dashboard

_Add Donor Dashboard Screenshot Here_

### Emergency Blood Request

_Add Blood Request Screenshot Here_

### Donor Matching Results

_Add Matching Results Screenshot Here_

### Real-Time Emergency Notification

_Add Real-Time Notification Screenshot Here_

---

# 🚀 Future Improvements

Potential future improvements include:

- Redis caching
- Geospatial database optimization
- Email/SMS emergency notifications
- Hospital verification
- Monitoring and observability
- Performance and load testing
- Advanced analytics
- Cloud deployment
- More comprehensive integration testing
- Improved matching model based on historical response data

These are planned improvements and are not represented as currently implemented functionality.

---

# 📈 Project Highlights

- Full-stack React + Spring Boot application
- Explainable multi-factor donor ranking algorithm
- Priority-based geographic donor filtering
- Blood compatibility validation
- 90-day donation eligibility rule
- JWT + Google OAuth2 authentication
- Role-based authorization
- Real-time WebSocket/STOMP emergency alerts
- PostgreSQL persistence with Spring Data JPA
- Dockerized backend and database environment
- Automated backend test suite
- Swagger/OpenAPI API documentation

---

# 👩‍💻 Author

## Mannat Sharma

Java • Spring Boot • React • PostgreSQL • Docker

---

# ⭐ BloodLink

### Connecting the right donor with the right emergency — faster.
