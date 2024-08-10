package org.example.websocket.model;

public enum QueryType {
  MQ("MQ"),
  EQ("EQ");

  public final String name;

  QueryType(String name) {
    this.name = name;
  }
}
