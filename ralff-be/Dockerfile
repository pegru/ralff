FROM maven:3.9.8-amazoncorretto-21-al2023 AS MVN_BUILDER
LABEL authors="petergrubelnik"
WORKDIR /app
COPY . .

RUN ["/usr/local/bin/mvn-entrypoint.sh", "mvn", "clean", "package", "--fail-never"]

FROM tomcat:10.1.20-jdk21

# Install additional dependencies
RUN apt-get update && apt-get install -y graphviz

# copy war file
COPY --from=MVN_BUILDER /app/target/ralff-be.war /usr/local/tomcat/webapps/ralff-be.war

CMD ["catalina.sh", "run"]