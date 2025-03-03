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

  @SerializedName("eqconfig")
  private final EqConfig eqconfig;

  @SerializedName("saveAllHypotheses")
  private final boolean saveAllHypotheses;

  public LearnerConfig(LearningAlgorithm algorithm, String name, String rankdir, EqConfig eqconfig, boolean saveAllHypotheses) {
    this.algorithm = algorithm;
    this.name = name;
    this.rankdir = rankdir;
    this.eqconfig = eqconfig;
    this.saveAllHypotheses = saveAllHypotheses;
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

  public EqConfig getEqConfig() {
    return eqconfig;
  }

  public boolean isSaveAllHypotheses() {
    return saveAllHypotheses;
  }
}
