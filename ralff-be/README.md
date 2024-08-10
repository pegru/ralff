# RALFF-BE

## Requirements

1. Maven 14.4.1
2. Java JDK 21.0.2

## Docker Setup

### Requirements
* docker (CLI), docker-compose, Rancher Desktop

1. Create output directory ```mkdir ./learned-models```

## Manual Setup Intellij IDEA

### Apache Tomcat

1. Install Apache Tomcat Version 10.1.20
    1. Download from official website: https://tomcat.apache.org/download-10.cgi  
       or
    2. ```brew install tomcat@10```

2. When using with intellij IDEA you can setup a Run Configuration...  
   Instructions
   from https://www.jetbrains.com/guide/java/tutorials/working-with-apache-tomcat/using-existing-application/
    1. Open `Run/Edit Configurations...`
    2. Left Pane select **Tomcat Server > Local**
    3. Give the configuration a name, f.e. Tomcat 10.1.18
    4. Click **Configure...** next to Application Server
        1. Insert Tomcat Home directory **\<path to download folder\>/tomcat/10.1.18/libexec**
        2. Done.
    5. Click Deployment Tab
        1. Click **+** and select **Artifact**
        2. Select **automata-learning:war exploded**
        3. Set Application Context to **/ralff-be**
    6. Click Startup/Connection
        1. Check "Pass Environment Variable"
        2. Set Variable "OUTDIR_LEARNED_MODELS: /your/local/output/dir"
    7. Click **Ok**. Setup Done.
    8. Run Tomcat Server
    9. Application is available under **http://localhost:8080/ralff-be/**
    10. Clients can connect to WebSocket on **ws://localhost:8080/ralff-be/websocket**
    11. Tomcat Server should be available under **http://localhost:8080/**

[//]: # (### LearnLib/RALib &#40;optional&#41;)

[//]: # ()

[//]: # (Step is optional and only required if one wants to experiment)

[//]: # (if RALib. It is not needed for running the basic Learner Setup.)

[//]: # ()

[//]: # (Before starting, download LearnLib/RALib from https://github.com/LearnLib/ralib.  )

[//]: # (Version in use is 0.1-SNAPSHOT.)

[//]: # ()

[//]: # (1. Open Terminal and navigate to Folder where zip was downloaded)

[//]: # (2. Unzip and navigate to created folder)

[//]: # (3. Execute ```mvn package assembly:single```)

[//]: # (4. Execute ```mvn install:install-file -Dfile=./target/ralib-0.1-SNAPSHOT.jar -DpomFile=pom.xml```)

[//]: # (5. Within this project run ```mvn clean -f pom.xml``` and ```mvn install -f pom.xml```)

[//]: # (6. Add to project pom.xml)

[//]: # (    ```)

[//]: # (    <dependency>)

[//]: # (        <groupId>de.learnlib</groupId>)

[//]: # (        <artifactId>ralib</artifactId>)

[//]: # (        <version>0.1-SNAPSHOT</version>)

[//]: # (    </dependency>)

[//]: # (    ```)