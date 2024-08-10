package org.example.automata.threading;

import jakarta.websocket.EncodeException;
import org.example.automata.controller.BufferedMessageHandler;
import org.example.automata.learner.BasicLearner;
import org.example.automata.learner.MealyLearner;
import org.example.automata.learner.MooreLearner;
import org.example.automata.learner.sul.mealy.MealySocketSUL;
import org.example.automata.learner.sul.moore.MooreSocketSUL;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;
import org.example.websocket.model.config.LearnerConfig;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

/**
 * LearnerThread, runs the experiment.
 * Required to free up LearnerController to further accept messages which get passed along to this thread over bufferedMessageHandler
 *
 * @author Peter Grubelnik
 */
public class LearnerThread implements Runnable {

  private final BufferedMessageHandler bufferedMessageHandler;
  private final Collection<String> inputAlphabet;
  private final LearnerConfig learnerConfig;

  public LearnerThread(BufferedMessageHandler bufferedMessageHandler, ArrayList<String> inputAlphabet, LearnerConfig learnerConfig) {
    this.inputAlphabet = new ArrayList<>(inputAlphabet);
    this.bufferedMessageHandler = bufferedMessageHandler;
    this.learnerConfig = learnerConfig;
  }

  @Override
  public void run() {
    try {
      System.out.println("Start learning...");
      if (learnerConfig == null) {
        throw new IllegalArgumentException("ERROR: No LearnerConfig provided.");
      }
      switch (learnerConfig.getAlgorithm()) {
        case MOORE:
          MooreSocketSUL mooreSocketSUL = new MooreSocketSUL(this.bufferedMessageHandler);
          MooreLearner mooreLearner = new MooreLearner(learnerConfig, this.bufferedMessageHandler);
          mooreLearner.runMooreExperiment(mooreSocketSUL, this.inputAlphabet);
          System.out.println("Writing SymbolTable...");
          mooreSocketSUL.writeToFile(learnerConfig.getName() + "-st-moore");
          break;
        case MEALY:
          MealySocketSUL mealySocketSUL = new MealySocketSUL(this.bufferedMessageHandler);
          MealyLearner mealyLearner = new MealyLearner(learnerConfig, this.bufferedMessageHandler);
          mealyLearner.runMealyExperiment(mealySocketSUL, BasicLearner.LearningMethod.LStar, BasicLearner.TestingMethod.RandomWalk, this.inputAlphabet);
          System.out.println("Writing SymbolTable...");
          mealySocketSUL.writeToFile(learnerConfig.getName() + "-st-mealy");
          break;
        default:
          throw new IllegalArgumentException("ERROR: Unsupported learning algorithm %s.".formatted(learnerConfig.getAlgorithm()));
      }
      this.bufferedMessageHandler.send(new Message.Builder(Command.FINISHED).withSymbol("Learning done.").build());
      System.out.println("Gracefully exiting Thread.");
    } catch (Exception e) {
      System.err.println("Shutting down thread..." + Thread.currentThread().toString());
      String result = Arrays.stream(e.getStackTrace()).toList().stream().map(StackTraceElement::toString).collect(Collectors.joining("\n"));
      System.err.println(result);
      System.err.println("Message: " + e.getMessage());

      try {
        Message m = new Message.Builder(Command.MESSAGE).withSymbol("ERROR: " + e.getMessage()).build();
        this.bufferedMessageHandler.send(m);
      } catch (EncodeException | IOException ex) {
        // ignore
      }
    } finally {
      try {
        this.bufferedMessageHandler.close();
      } catch (Exception e) {
        // ignore
      }
    }
  }
}
