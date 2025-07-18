<!-- README.md -->

# CoinChange – Virtual Cryptocurrency Exchange

<div align="center">
  <strong>Full-stack demo platform that simulates a real crypto-exchange experience</strong>  
  <em>React 18 · Spring Boot 3 · PostgreSQL 15 · JWT Security</em>

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)
</div>

## Table of Contents
1. Overview
2. Feature Highlights
3. High-level Architecture
4. Technology Stack
5. Quick Start
6. Project Structure
7. Configuration & Environments
8. Development Workflow
9. Deployment
10. Security Notes
11. License & Acknowledgements

---

## 1  Overview
CoinChange is an educational virtual cryptocurrency exchange platform where users can trade crypto with virtual funds in a risk-free environment. Real-time market data is fetched from the public Coinbase Exchange REST API, while user accounts, wallets, and order management are handled by a custom Spring Boot backend with PostgreSQL database.

**Key objectives:**
* Teach crypto trading fundamentals in a safe environment
* Demonstrate modern React + Spring Boot architecture
* Showcase security best practices (JWT, BCrypt, role-based access)
* Provide extensible foundation for future enhancements

---

## 2  Feature Highlights
### Trading
* **Quick Buy/Sell** – one-click market orders
* **Advanced Orders** – specify your own conversion rate
### Portfolio
* Multi-asset wallet with live P/L
### Profile
* Summary + edit of user´s profile data
* View and download full transaction history
### Cryptocurrencies
* Check actual stats of cryptocurrencies, Top gainers, New on CoinChange
### UX
* Responsive Material-UI design
* i18n (English / Czech)
* Leaderboard of top virtual traders
### Security
* Spring Security 6 + JWT (access & refresh)
* BCrypt password hashing
### API
* Full OpenAPI 3 generated API (both on frontend and backend) based on shared yaml files (same files shared between frontend and backend to ensure single place of truth)

---

## 3  High-level Architecture

┌──────────────────── Frontend ───────────────────┐
│ React 18 + TS · MUI · React Query · i18next │
│ ↳ /api/* → Java Backend (private endpoints) │
│ ↳ Coinbase Exchange API (public market data) │
└──────────────────────────────────────────────────┘
▲ ▲
│ │
PostgreSQL ◄─────┘ │
(Flyway) │
│
┌──────────────────── Backend ────────────────────┐
│ Spring Boot 3 · JPA · Spring Security │
│ Controllers → Services → DAOs → Repositories │
│ JWT auth · Caffeine cache · Schedulers │
└─────────────────────────────────────────────────┘

---

## 4  Technology Stack
| Layer        | Main technologies                                                                               |
|--------------|-------------------------------------------------------------------------------------------------|
| Frontend     | React 18, TypeScript 5, Vite, MUI 5, React Router 6, TanStack Query 4, Chart.js 4, i18next      |
| Backend      | Java 21, Spring Boot 3, Spring Security 6, Spring Data JPA, Lombok, Caffeine, Springdoc OpenAPI |
| Database     | PostgreSQL 15 (prod), H2 in-memory (dev)                                                        |
| Build Tools  | Maven 3.9, npm, Flyway migrations                                                               |
| External API | Coinbase Exchange REST API                                                                      |

---

## 5  Quick Start

### Prerequisites
* **Java 21**, **Node 18**, **Maven 3.9**, **Docker 24+**

### 1  Clone
git clone https://github.com/Luzkix/coinchange-demo-app.git
cd coinchange-demo-app

### 2  Backend
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=devel # H2 + Swagger UI

### 3  Frontend
cd ../frontend
npm install
npm run dev # http://localhost:8080

### 4  Docs
* Swagger UI → http://localhost:2000/swagger-ui.html
* OpenAPI JSON → http://localhost:2000/v3/api-docs

---

## 6  Project Structure

coinchange/
├─ backend/
│ ├─ src/main/java/org/luzkix/coinchange/
│ │ ├─ config/ Spring & security configuration
│ │ ├─ controller/ REST endpoints
│ │ ├─ dao/ Data Access Objects
│ │ ├─ dto/ Request/response DTOs and projections
│ │ ├─ model/ JPA entities
│ │ ├─ repository/ Spring Data interfaces
│ │ ├─ service/ Business logic layer
│ │ ├─ exceptions/ Custom exception classes
│ │ └─ utils/ Utility classes
│ └─ src/main/resources/
│ ├─ application.properties
│ └─ db/migration/ Flyway migration scripts
├─ frontend/
│ ├─ public/
│ └─ src/
│ ├─ components/ Reusable UI components
│ ├─ pages/ Route-level page components
│ ├─ contexts/ React contexts for state
│ ├─ services/ Axios API layer
│ ├─ locales/ i18n translation files
│ └─ api-generated/ Auto-generated API client
├─ api/ OpenAPI YAML specifications
└─ docs/ Project documentation


---

## 7  Configuration & Environments
`application-*.properties` (backend).

**Backend (Production profile):**

spring.datasource.username=${dbUsername}
spring.datasource.password=${dbPassword}
spring.datasource.url=jdbc:postgresql://${dbUrl}:${dbPort}/coinchange
spring.datasource.driver-class-name=org.postgresql.Driver
spring.flyway.enabled=true
spring.jpa.hibernate.ddl-auto=validate

jwt.secret=${Base64_secretKey_256bits}
jwt.expiration=${milliseconds}

fee.default-conversion-currency=EUR
conversion.validity=${seconds}


---

## 8  Development Workflow
1. committing directly to 'master' branch
2. no unit/integration testing

---

## 9  Deployment

* Create docker image using following commands:

docker build -f Dockerfile -t luzkix/coinchange:latest --no-cache .

docker push luzkix/coinchange:latest

* You can than run created container using following docker run command (you can adjust ports or ENV variables as needed):
  
docker run -d \
  --name coinchange \
  -p 200:8080 \
  -e SPRING_PROFILES_ACTIVE=devel \
  -e JWT_SECRET="bXktdmVyeS1zZWN1cmUtc2VjcmV0LWtleTEyMzQ1WEcqecqwecWQEc" \
  -e JWT_EXPIRATION=3600000 \
  -e SERVER_PORT=8080 \
  luzkix/coinchange:latest

* In this example the application will be accessible on port 200 (internally runs on port 8080), it runs with 'devel' profile (configuration of own DB is not needed since in-memory H2 DB will be used) 
* If you want to run it with real Postgres DB, you need to run it with 'prod' profile and you need to add additional ENV properties such as: DB_USERNAME, DB_PWD, DB_URL. Everything else remains same.

---

## 10  Security Notes
* BCrypt 12-round hashing
* Access + refresh JWTs, 60 min validity of JWT token
* Strict CORS (frontend origin only)


---

## 11  License & Acknowledgements
### License
*MIT License* — see `LICENSE`.  
Powered by the awesome open-source communities of Spring and React. Using free apis of Coinbase to load actual information about coins prices.
UI inspired by world best crypto exchanges coinbase.com and coinmate.io.

### Acknowledgements
* The layout of CoinChange app was inspired by these best crypto exchanges:
  * Coinbase.com
  * Coinmate.io