package org.example.websocket.model;

import java.io.Serializable;

public class Action implements Serializable {
  private final String node;
  private final String property;
  private final String value;

  public Action(String node, String property, String value) {
    this.node = node;
    this.property = property;
    this.value = value;
  }

  @Override
  public String toString() {
    return node + property + value;
  }
}
