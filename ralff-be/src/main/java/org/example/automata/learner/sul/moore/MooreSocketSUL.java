package org.example.automata.learner.sul.moore;

import de.learnlib.exception.SULException;
import jakarta.websocket.EncodeException;
import org.example.automata.controller.BufferedMessageHandler;
import org.example.automata.learner.sul.SocketSUL;
import org.example.automata.learner.sul.Symbol;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;

import java.io.IOException;

/**
 * Moore interface implementation to send and retrieve messages over jakarta WebSocket using Tomcat.
 *
 * @author Peter Grubelnik
 */
public class MooreSocketSUL extends SocketSUL {

  public MooreSocketSUL(BufferedMessageHandler bufferedMessageHandler) {
    super(bufferedMessageHandler);
  }

  public String currentStateOutput() {
    try {
      Message req = new Message.Builder(Command.OUTPUT).build();
      this.bufferedMessageHandler.send(req);
      Message response = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      if (!Command.OUTPUT.equals(response.getCommand())) {
        throw new SULException(new RuntimeException("Invalid message received: " + response.getCommand()));
      }
      if (response.getOutputs() == null) {
        throw new SULException(new IllegalArgumentException("Expected Output ArrayList but received null."));
      }
      Symbol symbol = new Symbol(response.getOutputs());
      this.symbolTable.add(symbol);
      return symbol.generateSymbol();
    } catch (IOException | EncodeException | ClassNotFoundException e) {
      throw new SULException(e);
    }
  }

  @Override
  public void pre() {
    try {
      Message req = new Message.Builder(Command.PRE).build();
      this.bufferedMessageHandler.send(req);
      Message response = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      if (Command.PRE == response.getCommand()) {
        return;
      }
      throw new RuntimeException("Expected PRE but received: " + response.getCommand());
    } catch (IOException | EncodeException | ClassNotFoundException e) {
      throw new SULException(e);
    }
  }

  @Override
  public String step(String in) {
    try {
      Message req = new Message.Builder(Command.STEP).withSymbol(in).build();
      this.bufferedMessageHandler.send(req);
      Message response = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      if (!Command.STEP.equals(response.getCommand())) {
        throw new SULException(new RuntimeException("Invalid message received: " + response.getCommand()));
      }
      if (response.getOutputs() == null && response.getSymbol() == null) {
        throw new SULException(new IllegalArgumentException("Expected Output ArrayList or Symbol but received null."));
      }
      if (response.getSymbol() != null) {
        return response.getSymbol();
      }
      Symbol symbol = new Symbol(response.getOutputs());
      this.symbolTable.add(symbol);
      return symbol.generateSymbol();
    } catch (IOException | EncodeException | ClassNotFoundException e) {
      throw new SULException(e);
    }
  }

  @Override
  public void post() {
    try {
      Message req = new Message.Builder(Command.POST).build();
      this.bufferedMessageHandler.send(req);
      Message response = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      if (Command.POST == response.getCommand()) {
        return;
      }
      throw new RuntimeException("Expected POST but received: " + response.getCommand());
    } catch (IOException | EncodeException | ClassNotFoundException e) {
      throw new SULException(e);
    }
  }

}
