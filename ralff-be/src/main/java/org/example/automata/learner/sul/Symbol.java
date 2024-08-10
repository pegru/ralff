package org.example.automata.learner.sul;

import com.google.gson.annotations.SerializedName;
import org.example.websocket.model.Action;

import java.util.ArrayList;
import java.util.Random;

public class Symbol {
  @SerializedName("symbol")
  private final String symbol;
  @SerializedName("outputs")
  private final ArrayList<Action> outputs;

  @Override
  public int hashCode() {
    StringBuilder sb = new StringBuilder();
    this.outputs.forEach(action -> sb.append(action.toString()));
    return sb.toString().hashCode();
  }

  @Override
  public boolean equals(Object obj) {
    if (obj instanceof Symbol s) {
      return this.hashCode() == s.hashCode();
    }
    return super.equals(obj);
  }

  public Symbol(ArrayList<Action> outputs) {
    this.outputs = outputs;
    this.symbol = generateSymbol();
  }

  public String generateSymbol() {
    if (symbol != null) {
      return symbol;
    }
    // https://www.baeldung.com/java-random-string; last accessed 08.02.2024
    int leftLimit = 97; // letter 'a'
    int rightLimit = 122; // letter 'z'
    int targetStringLength = 3;
    Random random = new Random(hashCode());
    return random.ints(leftLimit, rightLimit + 1)
        .limit(targetStringLength)
        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
        .toString();
  }
}
