package org.example.automata.controller;

import jakarta.websocket.EncodeException;
import jakarta.websocket.Session;
import org.example.websocket.model.Message;

import java.io.*;

/**
 * BufferedMessageHandler. This Handler connects a WebSocket Session incoming messages
 * to a piped InputStream. One can call readLine on the input stream to wait until server sends a response.
 * Sending messages appears straightforward over the current session.
 */
public class BufferedMessageHandler implements AutoCloseable {
  private Session session;
  private final ObjectInputStream objectInputStream;
  private final ObjectOutputStream objectOutputStream;

  public BufferedMessageHandler(Session session) throws IOException {
    this.session = session;
    PipedOutputStream pipedOutputStream = new PipedOutputStream();
    PipedInputStream pipedInputStream = new PipedInputStream(pipedOutputStream);
    this.objectOutputStream = new ObjectOutputStream(pipedOutputStream);
    this.objectInputStream = new ObjectInputStream(pipedInputStream);
  }

  public void setSession(Session session) {
    this.session = session;
  }

  public void write(Message message) {
    try {
      this.objectOutputStream.writeObject(message);
      this.objectOutputStream.flush();
    } catch (IOException e) {
      System.err.println("BufferedMessageHandler: " + e.toString());
    }
  }

  public void send(Message m) throws EncodeException, IOException {
    this.session.getBasicRemote().sendObject(m);
  }

  public ObjectInputStream getObjectInputStream() {
    return objectInputStream;
  }

  public ObjectOutputStream getObjectOutputStream() {
    return objectOutputStream;
  }

  @Override
  public void close() throws Exception {
    System.out.println("BufferedMessageHandler close().");
    this.objectInputStream.close();
    this.objectOutputStream.close();
  }
}
