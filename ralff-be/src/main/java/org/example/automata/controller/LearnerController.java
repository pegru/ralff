package org.example.automata.controller;

import jakarta.websocket.EncodeException;
import jakarta.websocket.MessageHandler;
import jakarta.websocket.Session;
import org.example.automata.threading.LearnerThread;
import org.example.automata.threading.TaskManager;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;

import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.Future;

/**
 * Single LearnerController to retrieve messages over an open WebSocket and forward messages to
 * the learning setup over a buffered input stream. This controller works as a mediator between WebSocket and
 * learnlib SUL implementation (@see de.learnlib.sul.SUL)
 */
public class LearnerController implements MessageHandler.Whole<Message>, AutoCloseable {
  public enum State {
    IDLE,
    RUNNING
  }

  private BufferedMessageHandler bufferedMessageHandler;
  private Session session;
  private Future<?> learnerThread;

  public LearnerController() {
  }

  public void connect(Session session) {
    if (session == null) {
      throw new IllegalArgumentException("Received null as Session");
    }
    this.session = session;
    // remove all default associated MessageHandlers
    ArrayList<MessageHandler> messageHandlers = new ArrayList<>(this.session.getMessageHandlers());
    messageHandlers.forEach(messageHandler -> this.session.removeMessageHandler(messageHandler));

    // add this message handler
    this.session.addMessageHandler(this);
    // update bufferedMessageHanlder
    if (this.bufferedMessageHandler != null) {
      this.bufferedMessageHandler.setSession(session);
    }
  }

  public void disconnect() {
    if (this.session != null) {
      this.session.removeMessageHandler(this);
      this.session = null;
    }
    if (this.bufferedMessageHandler != null) {
      this.bufferedMessageHandler.setSession(null);
    }
    if (this.learnerThread != null) {
      this.learnerThread.cancel(true);
    }
  }

  @Override
  public void onMessage(Message message) {
    try {
      switch (message.getCommand()) {
        case START:
          this.bufferedMessageHandler = new BufferedMessageHandler(this.session);
          ArrayList<String> alphabet = message.getAlphabet() != null ? message.getAlphabet() : new ArrayList<>();
          this.learnerThread = TaskManager.getInstance().submitTask(new LearnerThread(bufferedMessageHandler, alphabet, message.getLearnerConfig()));
          break;
        case STOP:
          if (this.learnerThread != null) {
            Message m = new Message.Builder(Command.MESSAGE).withSymbol("Stopping Learner Thread.").build();
            this.session.getBasicRemote().sendObject(m);
            this.learnerThread.cancel(true);
          }
          if (this.bufferedMessageHandler != null) {
            this.bufferedMessageHandler.close();
          }
          break;
        case OUTPUT:
        case ALPHABET:
        case PRE:
        case STEP:
        case POST:
          // forward message
          if (this.bufferedMessageHandler != null) {
            this.bufferedMessageHandler.write(message);
          }
          break;
        default:
          System.err.println("ControllerLearner received unknown command");
          System.err.println(message);
          break;
      }
    } catch (Exception e) {
      System.out.println(e.toString());
      try {
        Message m = new Message.Builder(Command.MESSAGE).withSymbol(e.getMessage()).build();
        this.session.getBasicRemote().sendObject(m);
      } catch (EncodeException | IOException ex) {
        // ignore
      }
    }
  }

  @Override
  public void close() throws Exception {
    System.out.println("ControllerLearner: close");
    if (this.learnerThread != null) {
      System.out.println("LearnerController: Shutting down learnerThread...");
      this.learnerThread.cancel(true);
    }
    System.out.println("LearnerController: Closing Stream.");
    if (this.bufferedMessageHandler != null) {
      this.bufferedMessageHandler.close();
    }
    this.disconnect();
  }

  public LearnerController.State getState() {
    if (this.learnerThread == null || this.learnerThread.isCancelled() || this.learnerThread.isDone()) {
      return State.IDLE;
    } else {
      return State.RUNNING;
    }
  }
}
