package org.example.websocket.model.config;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class LearnerConfig implements Serializable {
  @SerializedName("algorithm")
  private final LearningAlgorithm algorithm;

  @SerializedName("name")
  private final String name;

  @SerializedName("rankdir")
  private final String rankdir;

  public LearnerConfig(LearningAlgorithm algorithm, String name, String rankdir) {
    this.algorithm = algorithm;
    this.name = name;
    this.rankdir = rankdir;
  }

  public LearningAlgorithm getAlgorithm() {
    return algorithm;
  }

  public String getName() {
    return name;
  }

  public String getRankdir() {
    return rankdir;
  }
}
