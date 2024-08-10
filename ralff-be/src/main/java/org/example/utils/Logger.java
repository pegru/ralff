package org.example.utils;

public class Logger {
  private final boolean isEnabled;
  private final String name;


  public Logger(boolean isEnabled, String name) {
    this.isEnabled = isEnabled;
    this.name = name;
  }

  public Logger(boolean isEnabled) {
    this.isEnabled = isEnabled;
    this.name = null;
  }

  public void log(String... args) {
    System.out.println(args);
  }
}
