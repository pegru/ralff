package org.example;

public class RunConfig {
  public static String OUTDIR_ENV_VARIABLE = "OUTDIR_LEARNED_MODELS";
  public static String SINK_OUTPUT = "sink"; // used to identify sink state
  public static String OUTPUT_DIR = System.getenv(OUTDIR_ENV_VARIABLE);
  public static String INTERMEDIATE_HYPOTHESIS_FILENAME = "hypothesis"; // a number gets appended for every iteration
}
