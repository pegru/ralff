package org.example.websocket.model.config;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class EqConfig implements Serializable {
  @SerializedName("randomWalkChanceOfResetting")
  private final double randomWalkChanceOfResetting;

  @SerializedName("randomWalkNumberOfSymbols")
  private final int randomWalkNumberOfSymbols;

  @SerializedName("randomWordsMinLength")
  private final int randomWordsMinLength;

  @SerializedName("randomWordsMaxLength")
  private final int randomWordsMaxLength;

  @SerializedName("randomWordsMaxTests")
  private final int randomWordsMaxTests;

  public EqConfig(double randomWalkChanceOfResetting, int randomWalkNumberOfSymbols, int randomWordsMinLength, int randomWordsMaxLength, int randomWordsMaxTests) {
    this.randomWalkChanceOfResetting = randomWalkChanceOfResetting;
    this.randomWalkNumberOfSymbols = randomWalkNumberOfSymbols;
    this.randomWordsMinLength = randomWordsMinLength;
    this.randomWordsMaxLength = randomWordsMaxLength;
    this.randomWordsMaxTests = randomWordsMaxTests;
  }

  public double getRandomWalkChanceOfResetting() {
    return randomWalkChanceOfResetting;
  }

  public int getRandomWalkNumberOfSymbols() {
    return randomWalkNumberOfSymbols;
  }

  public int getRandomWordsMinLength() {
    return randomWordsMinLength;
  }

  public int getRandomWordsMaxLength() {
    return randomWordsMaxLength;
  }

  public int getRandomWordsMaxTests() {
    return randomWordsMaxTests;
  }
}