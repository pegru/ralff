package org.example.websocket.model;

import com.google.gson.annotations.SerializedName;
import org.example.websocket.model.config.LearnerConfig;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

public class Message implements Serializable {

  // TODO create own class per command
  @SerializedName("config")
  private final LearnerConfig learnerConfig;
  @SerializedName("command")
  private final Command command;
  @SerializedName("symbol")
  private final String symbol;
  @SerializedName("alphabet")
  private ArrayList<String> alphabet;
  @SerializedName("outputs")
  private ArrayList<Action> outputs;
  @SerializedName("session")
  private SessionCtx sessionCtx;
  @SerializedName("queryType")
  private QueryType queryType;

  private Message(Builder builder) {
    this.command = builder.command;
    this.symbol = builder.symbol;
    this.alphabet = builder.alphabet;
    this.outputs = builder.outputs;
    this.sessionCtx = builder.sessionCtx;
    this.learnerConfig = builder.learnerConfig;
    this.queryType = builder.queryType;
  }

  public static class Builder {
    private final Command command;
    private String symbol;

    private QueryType queryType;
    private ArrayList<String> alphabet;
    private ArrayList<Action> outputs;
    private SessionCtx sessionCtx;
    private LearnerConfig learnerConfig;

    public Builder(Command command) {
      this.command = command;
    }

    public Builder withSymbol(String sym) {
      this.symbol = sym;
      return this;
    }

    public Builder withQueryType(QueryType queryType) {
      this.queryType = queryType;
      return this;
    }

    public Builder withSessionCtx(SessionCtx sessionCtx) {
      this.sessionCtx = sessionCtx;
      return this;
    }

    public Builder withAlphabet(Collection<String> alphabet) {
      this.alphabet = new ArrayList<>(alphabet);
      return this;
    }

    public Builder withOutputs(Collection<Action> outputs) {
      this.outputs = new ArrayList<>(outputs);
      return this;
    }

    public Message build() {
      return new Message(this);
    }
  }

  public Command getCommand() {
    return command;
  }

  public String getSymbol() {
    return symbol;
  }

  public ArrayList<String> getAlphabet() {
    return alphabet;
  }

  public ArrayList<Action> getOutputs() {
    return outputs;
  }

  public SessionCtx getSession() {
    return sessionCtx;
  }

  public void setAlphabet(ArrayList<String> alphabet) {
    this.alphabet = alphabet;
  }

  public LearnerConfig getLearnerConfig() {
    return learnerConfig;
  }

  @Override
  public String toString() {
    String cmdStr = "Command: " + command + "\n";
    String symStr = "Symbol: " + symbol + "\n";
    String alphabetStr = "Alphabet: " + arrayToString(this.alphabet) + "\n";
    return cmdStr + symStr + alphabetStr;
  }

  private String arrayToString(ArrayList<String> arr) {
    if (arr == null) {
      return "null";
    }
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < arr.size(); i++) {
      sb.append(arr.get(i));
      if (i < arr.size() - 1) {
        sb.append(", ");
      }
    }
    sb.append("]");
    return sb.toString();
  }
}
