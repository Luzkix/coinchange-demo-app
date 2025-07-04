# ---------- Stage 1: Build frontend ----------
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# Instalace závislostí (cacheable)
COPY frontend/package*.json ./
RUN npm ci

# Kopírování zdrojů a build Vite výstupu do dist/
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: Build backend ----------
FROM maven:3.9.8-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app

# Copy OpenAPI spec pro generování klienta
COPY api /api

# Přednačtení Maven závislostí (cacheable) - OPRAVENO
COPY backend/pom.xml ./
COPY backend/mvnw ./
COPY backend/.mvn ./.mvn

RUN chmod +x mvnw \
    && ./mvnw dependency:go-offline -B

# Kopie backend zdrojů + statiky z frontendu
COPY backend/src src/
COPY --from=frontend-build /app/frontend/dist/ src/main/resources/public/

# Kompilace Spring Boot aplikace (skip testů)
RUN ./mvnw clean package -DskipTests -B

# ---------- Stage 3: Final runtime image ----------
FROM gcr.io/distroless/java21-debian12
WORKDIR /app

# Přenos vygenerovaného JAR souboru
COPY --from=backend-build /app/target/coinchange-backend-*.jar app.jar

# Defaultní environment proměnné (lze přepsat při docker run)
ENV SPRING_PROFILES_ACTIVE=devel \
    SERVER_PORT=2000 \
    JWT_SECRET=changeME \
    JWT_EXPIRATION=3600000 \
    CONVERSION_VALIDITY=10 \
    DEFAULT_CURRENCY=EUR \
    LOGGING_LVL=WARN

EXPOSE ${SERVER_PORT}

# Spuštění Spring Bootu; env přepíše parametry
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
