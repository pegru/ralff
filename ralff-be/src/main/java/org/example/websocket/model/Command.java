package org.example.websocket.model;

import java.io.Serializable;

public enum Command implements Serializable {
  START("START"),
  STOP("STOP"),
  PRE("PRE"),
  STEP("STEP"),
  OUTPUT("OUTPUT"),
  POST("POST"),
  FINISHED("FINISHED"),
  ALPHABET("ALPHABET"),
  MESSAGE("MESSAGE"),
  SESSION("SESSION"),
  RESTORE("RESTORE");

  public final String name;

  Command(String name) {
    this.name = name;
  }
}
