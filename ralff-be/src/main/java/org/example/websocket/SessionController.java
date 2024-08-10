package org.example.websocket;

import jakarta.websocket.Session;
import org.example.automata.controller.LearnerController;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;
import org.example.websocket.model.SessionCtx;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * SessionController, holds logic to reconnect client after performing a hard-reset
 * Forwards messages to LearnerController
 *
 * @author Peter Grubelnik
 */
public class SessionController implements Serializable {

  private final Map<String, LearnerController> sulMap;
  private final Map<String, Session> sessionRegistry;

  public SessionController() {
    this.sulMap = new HashMap<>();
    this.sessionRegistry = new HashMap<>();
  }

  public void registerSession(Session session) {
    this.sessionRegistry.put(session.getId(), session);
  }

  public void unregisterSession(Session session) {
    LearnerController learnerController = sulMap.get(session.getId());
    learnerController.disconnect();
    this.sessionRegistry.remove(session.getId());
  }

  public void connectController(SessionCtx sessionCtx) throws Exception {
    if (sulMap.containsKey(sessionCtx.oldSessionId())) {
      // restore connection
      LearnerController learnerController = sulMap.get(sessionCtx.oldSessionId());
      // delete old sessionId entry
      this.sulMap.remove(sessionCtx.oldSessionId());
      if (sessionCtx.newSessionId() == null) {
        throw new IllegalArgumentException("Invalid SessionCtx. newSessionId is null.");
      }
      Session session = this.sessionRegistry.get(sessionCtx.newSessionId());
      this.sulMap.put(session.getId(), learnerController);
      learnerController.connect(session);

      if (learnerController.getState() == LearnerController.State.RUNNING) {
        // notify SUL
        Message m = new Message.Builder(Command.RESTORE).build();
        session.getBasicRemote().sendObject(m);
        return;
      } else {
        Message m = new Message.Builder(Command.MESSAGE).withSymbol("Connection restored.").build();
        session.getBasicRemote().sendObject(m);
        return;
      }
    } else {
      // create new learnerController
      LearnerController learnerController = new LearnerController();
      Session session = this.sessionRegistry.get(sessionCtx.newSessionId());
      this.sulMap.put(session.getId(), learnerController);
      learnerController.connect(session);

      Message m = new Message.Builder(Command.MESSAGE).withSymbol("Connection established.").build();
      session.getBasicRemote().sendObject(m);
      return;
    }
  }

  public void cleanup(SessionCtx sessionCtx) {
    try {
      String oldSessionId = sessionCtx.oldSessionId();
      if (oldSessionId != null) {
        this.sessionRegistry.remove(oldSessionId);
        LearnerController learnerController = this.sulMap.get(oldSessionId);
        if (learnerController != null) {
          learnerController.close();
        }
        this.sulMap.remove(oldSessionId);
      }
    } catch (Exception e) {/* ignore*/ }

    try {
      String newSessionId = sessionCtx.newSessionId();
      if (newSessionId != null) {
        this.sessionRegistry.remove(newSessionId);
        LearnerController learnerController = this.sulMap.get(newSessionId);
        if (learnerController != null) {
          learnerController.close();
        }
        this.sulMap.remove(newSessionId);
      }
    } catch (Exception e) {/* ignore*/ }
  }

  public void close(Session session) {
    try {
      this.sulMap.get(session.getId()).close();
    } catch (Exception e) {
      // ignore
    } finally {
      this.unregisterSession(session);
      this.sulMap.remove(session.getId());
    }
  }
}
