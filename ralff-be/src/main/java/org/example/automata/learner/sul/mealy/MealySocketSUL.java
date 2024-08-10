package org.example.automata.learner.sul.mealy;

import de.learnlib.exception.SULException;
import jakarta.websocket.EncodeException;
import org.example.RunConfig;
import org.example.automata.controller.BufferedMessageHandler;
import org.example.automata.learner.sul.SocketSUL;
import org.example.automata.learner.sul.Symbol;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;

import java.io.IOException;
import java.util.Objects;

/**
 * Socket interface implementation to send and retrieve messages over jakarta WebSocket using Tomcat.
 *
 * @author Peter Grubelnik
 */
public class MealySocketSUL extends SocketSUL {
  /**
   * BufferedMessageHandler connected to socket session
   */

  private boolean isInSinkState = false; // special flag required if we detect an sink answer from the real SUL
//  // upon this flag is true, we always return the empty alphabet. If we would not disable the inputs, the learning would result
//  // in an infinity loop as upon entering something invalid (that is what we define on the SUL implementation)

  public MealySocketSUL(BufferedMessageHandler bufferedMessageHandler) {
    super(bufferedMessageHandler);
  }

  @Override
  public void pre() {
    // add any code here that should be run at the beginning of every membership query,
    // i.e. put the system in its initial state
    try {
      Message req = new Message.Builder(Command.PRE).build();
      this.bufferedMessageHandler.send(req);
      Message response = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      if (Command.PRE.equals(response.getCommand())) {
        return;
      }
      throw new IllegalArgumentException("Expected PRE command but received: " + response.getCommand());
    } catch (IOException | EncodeException | ClassNotFoundException e) {
      throw new SULException(e);
    }
  }

  @Override
  public String step(String in) {
    // if we detect an 'sink' output from the SUL we reply with sink output on further symbols
    if (this.isInSinkState) {
      return RunConfig.SINK_OUTPUT;
    }

    Message req = new Message.Builder(Command.STEP).withSymbol(in).build();
    try {
      bufferedMessageHandler.send(req);
      Message response = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      if (!Command.STEP.equals(response.getCommand())) {
        throw new IllegalArgumentException("Expected POST command but received: " + response.getCommand());
      }
      if (response.getOutputs() == null && response.getSymbol() == null) {
        throw new IllegalArgumentException("Expected Output ArrayList or Symbol but received null.");
      }

      // update if we are in sink state which is immediately upon receiving first sink response
      if (Objects.equals(RunConfig.SINK_OUTPUT, response.getSymbol())) {
        this.isInSinkState = true;
      }

      if (response.getSymbol() != null) {
        return response.getSymbol();
      }
      if (response.getOutputs() != null) {
        Symbol symbol = new Symbol(response.getOutputs());
        this.symbolTable.add(symbol);
        return symbol.generateSymbol();
      }
      throw new SULException(new IllegalArgumentException("Could not receive valid output from SUL"));
    } catch (IOException | EncodeException | ClassNotFoundException e) {
      System.err.println("SocketSUL Exception: " + e.toString());
      throw new SULException(e);
    }
  }

  @Override
  public void post() {
    // cleanup method after executing membership query
    this.isInSinkState = false;

    try {
      Message req = new Message.Builder(Command.POST).build();
      this.bufferedMessageHandler.send(req);
      Message response = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      if (Command.POST.equals(response.getCommand())) {
        return;
      }
      throw new IllegalArgumentException("Expected POST command but received: " + response.getCommand());
    } catch (IOException | EncodeException | ClassNotFoundException e) {
      throw new SULException(e);
    }
  }

}
