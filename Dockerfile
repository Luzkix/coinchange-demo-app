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
FROM maven:3.9.8-eclipse-temurin-21 AS backend-build
WORKDIR /app

# Copy OpenAPI spec pro generování klienta
COPY api /api

# Přednačtení Maven závislostí (cacheable)
COPY backend/pom.xml ./
COPY backend/mvnw ./
COPY backend/.mvn ./.mvn
RUN chmod +x mvnw \
 && ./mvnw dependency:go-offline -B

# Kopie backend zdrojů
COPY backend/src src/

# Zkopírování frontend dist výstupu (včetně public assets) do Spring static
COPY --from=frontend-build /app/frontend/dist/ src/main/resources/static/

# Kompilace Spring Boot aplikace (skip testů)
RUN chmod +x mvnw \
 && ./mvnw clean package -DskipTests -B

# ---------- Stage 3: Final runtime image ----------
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

# Přenos vygenerovaného JAR souboru
COPY --from=backend-build /app/target/coinchange-backend-*.jar app.jar

# Defaultní environment proměnné (lze přepsat při docker run)
ENV SPRING_PROFILES_ACTIVE=devel \
    SERVER_PORT=2000 \
    LOGGING_LVL=WARN \
    CONVERSION_VALIDITY=10 \
    DEFAULT_CURRENCY=EUR

EXPOSE ${SERVER_PORT}

# Spuštění aplikace s předáním profilů a portu
ENTRYPOINT ["sh","-c","java -jar /app/app.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE} --server.port=${SERVER_PORT}"]
