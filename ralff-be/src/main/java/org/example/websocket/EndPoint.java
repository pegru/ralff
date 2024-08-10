package org.example.websocket;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.example.websocket.codec.MessageDecoder;
import org.example.websocket.codec.MessageEncoder;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;
import org.example.websocket.model.SessionCtx;

import java.io.IOException;

// sources from https://github.com/apache/tomcat/blob/9.0.x/webapps/examples/WEB-INF/classes/websocket/chat/ChatAnnotation.java
// last accessed 26.01.2024

@ServerEndpoint(value = "/websocket", encoders = MessageEncoder.class, decoders = MessageDecoder.class)
public class EndPoint implements MessageHandler.Whole<Message> {

  static final SessionController sessionController = new SessionController();

  @OnOpen
  public void onOpen(Session session, EndpointConfig ec) {
    System.out.println("Tomcat: onOpen WebSocket");
    session.setMaxBinaryMessageBufferSize(10000);
    session.setMaxTextMessageBufferSize(10000);
    session.setMaxIdleTimeout(-1);
    System.out.println("Tomcat: Session ID " + session.getId());
    try {
      synchronized (sessionController) {
        sessionController.registerSession(session);
      }
      // send sessionID for automatic reconnection
      System.out.println("Tomcat: Sending SessionId: " + session.getId());
      Message m = new Message.Builder(Command.SESSION).withSessionCtx(new SessionCtx(null, session.getId())).build();
      session.addMessageHandler(this);
      session.getBasicRemote().sendObject(m);
    } catch (IOException | EncodeException e) {
      // ignore
      System.out.println(e.toString());
    }
  }

  @OnClose
  public void onClose(Session session, CloseReason closeReason) {
    System.out.println("onClose WebSocket");

    try {
      synchronized (sessionController) {
        sessionController.unregisterSession(session);
      }
    } catch (Exception e) {
      // ignore
    }
  }

  @OnError
  public void onError(Session session, Throwable t) {
    System.out.println("onError: " + t.toString());
    synchronized (sessionController) {
      sessionController.close(session);
    }
  }

  @Override
  public void onMessage(Message message) {
    try {
      if (message.getCommand() == Command.SESSION) {
        synchronized (sessionController) {
          sessionController.connectController(message.getSession());
        }
      }
    } catch (Exception e) {
      sessionController.cleanup(message.getSession());
      System.out.println(e.toString());
    }
  }
}
