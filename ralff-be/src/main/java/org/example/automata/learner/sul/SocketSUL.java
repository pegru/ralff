package org.example.automata.learner.sul;

import com.google.gson.Gson;
import de.learnlib.exception.SULException;
import de.learnlib.sul.StateLocalInputSUL;
import org.example.RunConfig;
import org.example.automata.controller.BufferedMessageHandler;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public abstract class SocketSUL implements StateLocalInputSUL<String, String> {

  protected final Set<Symbol> symbolTable = new HashSet<>();
  protected final Gson gson = new Gson();

  protected final BufferedMessageHandler bufferedMessageHandler;

  public SocketSUL(BufferedMessageHandler bufferedMessageHandler) {
    this.bufferedMessageHandler = bufferedMessageHandler;
  }

  @Override
  public Collection<String> currentlyEnabledInputs() {
    try {
      Message req = new Message.Builder(Command.ALPHABET).build();
      this.bufferedMessageHandler.send(req);
      Message res = (Message) bufferedMessageHandler.getObjectInputStream().readObject();
      return res.getAlphabet();
    } catch (Exception e) {
      throw new SULException(e);
    }
  }

  public void writeToFile(String fileName) {
    if (RunConfig.OUTPUT_DIR == null) {
      System.out.println("Environment variable OUTDIR_ENV_VARIABLE not set.");
      return;
    }
    Path root = Paths.get(RunConfig.OUTPUT_DIR);
    String fullFileName = root.resolve(fileName).toString();
    try (FileWriter file = new FileWriter(fullFileName + ".json")) {
      file.write(gson.toJson(this.symbolTable.toArray()));
    } catch (IOException e) {
      System.out.println(e.toString());
    }
  }

}
