FROM maven:3.9.8-amazoncorretto-21-al2023 AS MVN_BUILDER
LABEL authors="petergrubelnik"
WORKDIR /app
COPY . .

RUN ["/usr/local/bin/mvn-entrypoint.sh", "mvn", "verify", "clean", "package", "--fail-never"]

FROM tomcat:10.1.20-jdk21
COPY --from=MVN_BUILDER /app/target/ralff-be.war /usr/local/tomcat/webapps/ralff-be.war
RUN apt-get update && apt-get install -y graphviz
CMD ["catalina.sh", "run"]