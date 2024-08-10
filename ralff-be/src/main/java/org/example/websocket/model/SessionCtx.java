package org.example.websocket.model;

import java.io.Serializable;

public record SessionCtx(String oldSessionId, String newSessionId) implements Serializable {
}
