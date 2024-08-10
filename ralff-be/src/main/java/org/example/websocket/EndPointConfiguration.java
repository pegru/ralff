package org.example.websocket;

import jakarta.websocket.Endpoint;
import jakarta.websocket.server.ServerApplicationConfig;
import jakarta.websocket.server.ServerEndpointConfig;

import java.util.HashSet;
import java.util.Set;

// sources from https://github.com/apache/tomcat/blob/9.0.x/webapps/examples/WEB-INF/classes/websocket/ExamplesConfig.java
// last accessed 26.01.2024

public class EndPointConfiguration implements ServerApplicationConfig {
    @Override
    public Set<ServerEndpointConfig> getEndpointConfigs(Set<Class<? extends Endpoint>> endpointClasses) {
        System.out.println("getEndpointConfigs");
        // should not be called
        return null;
    }

    @Override
    public Set<Class<?>> getAnnotatedEndpointClasses(Set<Class<?>> scanned) {
        Set<Class<?>> results = new HashSet<>();
        for (Class<?> clazz : scanned) {
            System.out.println(clazz.getPackage().getName());
            if (clazz.getPackage().getName().startsWith("org.example.websocket")) {
                System.out.println("Adding EndPoint: " + clazz);
                results.add(clazz);
            }
        }
        return results;
    }
}
