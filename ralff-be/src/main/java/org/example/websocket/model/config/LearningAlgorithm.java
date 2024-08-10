package org.example.websocket.model.config;

import java.io.Serializable;

public enum LearningAlgorithm implements Serializable {
  MEALY("MEALY"),
  MOORE("MOORE");

  private final String name;

  LearningAlgorithm(String name) {
    this.name = name;
  }
}
