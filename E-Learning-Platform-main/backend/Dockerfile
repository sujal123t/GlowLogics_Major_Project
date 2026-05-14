# Stage 1: Build the Java Application using Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application, skipping tests to speed up deployment
RUN mvn clean package -DskipTests

# Stage 2: Run the Application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copy the compiled JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Start the Spring Boot app and bind to the PORT environment variable provided by Render
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=$PORT"]