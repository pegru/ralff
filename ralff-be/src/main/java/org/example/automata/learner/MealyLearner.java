package org.example.automata.learner;

import de.learnlib.algorithm.lstar.mealy.ExtensibleLStarMealy;
import de.learnlib.algorithm.lstar.mealy.ExtensibleLStarMealyBuilder;
import de.learnlib.oracle.EquivalenceOracle;
import de.learnlib.oracle.MembershipOracle;
import de.learnlib.oracle.equivalence.mealy.RandomWalkEQOracle;
import de.learnlib.query.DefaultQuery;
import de.learnlib.sul.SUL;
import de.learnlib.sul.StateLocalInputSUL;
import jakarta.websocket.EncodeException;
import net.automatalib.alphabet.Alphabet;
import net.automatalib.alphabet.GrowingMapAlphabet;
import net.automatalib.automaton.transducer.CompactMealy;
import net.automatalib.automaton.transducer.MealyMachine;
import net.automatalib.util.automaton.transducer.MealyFilter;
import net.automatalib.word.Word;
import org.apache.commons.lang3.NotImplementedException;
import org.example.RunConfig;
import org.example.automata.controller.BufferedMessageHandler;
import org.example.automata.learner.sul.mealy.MealyOracleSUL;
import org.example.automata.learner.sul.mealy.MealySocketSUL;
import org.example.automata.learner.sul.mealy.NonDeterminismCheckingSUL;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;
import org.example.websocket.model.QueryType;
import org.example.websocket.model.config.LearnerConfig;

import java.io.IOException;
import java.util.Calendar;
import java.util.Collection;
import java.util.Random;

/**
 * Basic MealyLearner setup.
 * Sources from basic-learning: <a href="https://gitlab.science.ru.nl/ramonjanssen/basic-learning">https://gitlab.science.ru.nl/ramonjanssen/basic-learning</a>
 * last accessed 29.01.2024
 * Commit hash: 8b86aaeb946653141a3ba884f45ff9f0c73531b2
 *
 * @author Ramon Janssen
 * <p>
 * Enhanced with sink state representation and filter for sink states
 */
public class MealyLearner extends BasicLearner {
  private static final String FILE_NAME_EXTENSION = "mealy";

  public MealyLearner(LearnerConfig learnerConfig, BufferedMessageHandler bufferedMessageHandler) {
    super(learnerConfig, FILE_NAME_EXTENSION, bufferedMessageHandler);
  }

  /**
   * More detailed example of running a learning experiment. Starts learning, and then loops testing,
   * and if counterexamples are found, refining again. Also prints some statistics about the experiment
   *
   * @param mealySocketSUL Direct access to SUL
   * @param learningMethod One of the default learning methods from this class
   * @param testingMethod  One of the default testing methods from this class
   * @param alphabet       Input alphabet
   * @throws IOException test
   */
  public void runMealyExperiment(
      MealySocketSUL mealySocketSUL,
      LearningMethod learningMethod,
      TestingMethod testingMethod,
      Collection<String> alphabet
  ) throws IOException, EncodeException {
    GrowingMapAlphabet<String> growingMapAlphabet = new GrowingMapAlphabet<>(alphabet);
    LearningMealySetup learningMealySetup = new LearningMealySetup(mealySocketSUL, learningMethod, testingMethod, growingMapAlphabet);
    runMealyExperiment(learningMealySetup, growingMapAlphabet);
  }


  /**
   * More detailed example of running a learning experiment. Starts learning, and then loops testing,
   * and if counterexamples are found, refining again. Also prints some statistics about the experiment
   *
   * @param learnerSetup learning setup
   * @param alphabet     Input alphabet
   * @throws IOException
   */
  private void runMealyExperiment(LearningMealySetup learnerSetup, Alphabet<String> alphabet) throws IOException, EncodeException {
    ExtensibleLStarMealy<String, String> learner = learnerSetup.learner;
    EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> eqOracle = learnerSetup.eqOracle;
    try {
      // prepare some counters for printing statistics
      int stage = 0;

      // notify SUL Observer script that we start asking MQs
      this.bufferedMessageHandler.send(new Message.Builder(Command.MESSAGE).withQueryType(QueryType.MQ).build());
      // learn the first hypothesis
      learner.startLearning();

      while (true) {
        // store hypothesis as file
        if (saveAllHypotheses) {
          String outputFilename = RunConfig.INTERMEDIATE_HYPOTHESIS_FILENAME + stage;
          produceOutput(outputFilename, learner.getHypothesisModel(), alphabet, false);
          System.out.println("model size " + learner.getHypothesisModel().getStates().size());
        }

        // Print statistics
        System.out.println(stage + ": " + Calendar.getInstance().getTime());
        System.out.println("Hypothesis size: " + learner.getHypothesisModel().size() + " states");

        // notify SUL Observer script that we start asking EQs
        this.bufferedMessageHandler.send(new Message.Builder(Command.MESSAGE).withQueryType(QueryType.EQ).build());
        // Search for CE
        DefaultQuery<String, Word<String>> ce = eqOracle.findCounterExample(learner.getHypothesisModel(), alphabet);

        if (ce == null) {
          // No counterexample found, stop learning
          System.out.println("\nFinished learning!");
          boolean writeSuccess = produceOutput(MODEL_FILENAME + "-sink", learner.getHypothesisModel(), alphabet, true);
          if (writeSuccess) {
            // produce output filtered by sink transitions
            CompactMealy<String, String> filteredMealy = MealyFilter.pruneTransitionsWithOutput(learner.getHypothesisModel(), alphabet, RunConfig.SINK_OUTPUT);
            produceOutput(MODEL_FILENAME, filteredMealy, alphabet, true);
          }
          break;
        } else {
          // Counterexample found, rinse and repeat
          System.out.println("CE: " + ce);
          System.out.println("Member answer:\t" + ce.getOutput());
          System.out.println("Learner answer:\t" + learner.getHypothesisModel().computeSuffixOutput(ce.getPrefix(), ce.getSuffix()));
          System.out.println();
          stage++;
          // notify SUL Observer script that we start asking MQs again
          this.bufferedMessageHandler.send(new Message.Builder(Command.MESSAGE).withQueryType(QueryType.MQ).build());
          learner.refineHypothesis(ce);
        }
      }
    } catch (Exception e) {
      if (saveOnCrash) {
        produceOutput("hyp.before.crash.dot", learner.getHypothesisModel(), alphabet, true);
      }
      throw e;
    }
  }

  /**
   * Helper class to configure a learning and equivalence oracle. Tell it which learning and testing method you
   * want, and it produces the corresponding oracles (and counters for statistics) as attributes.
   */
  protected static class LearningMealySetup {
    /*Testing algorithm, wrapping the SUL*/
    public final EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> eqOracle;

    /* Learning algorithm, wrapping the SUL*/
    public final ExtensibleLStarMealy<String, String> learner;

    /**
     * For random walk, the chance to reset after every input
     */
    public static double randomWalk_chanceOfResetting = 0.1;
    /**
     * For random walk, the number of symbols that is tested in total (maybe with resets in between).
     */
    public static int randomWalk_numberOfSymbols = 50;
    /**
     * MaxDepth-parameter for W-method and Wp-method. This acts as the parameter 'n' for an n-complete test suite.
     * Typically not larger than 3. Decrease for quicker runs.
     */
    public static int w_wp_methods_maxDepth = 2;

    public LearningMealySetup(MealySocketSUL mealySocketSUL, LearningMethod learningMethod, TestingMethod testingMethod, Alphabet<String> alphabet) {
      // Wrap the SUL in a detector for non-determinism
      StateLocalInputSUL<String, String> nonDetSul = new NonDeterminismCheckingSUL<String, String>(mealySocketSUL);
      // we should use the sul only through those wrappers

      // Most testing/learning-algorithms want a membership-oracle instead of a SUL directly
      MembershipOracle.MealyMembershipOracle<String, String> sulOracle = new MealyOracleSUL(nonDetSul, RunConfig.SINK_OUTPUT);

      // Choosing an equivalence oracle
      eqOracle = loadTester(testingMethod, mealySocketSUL, sulOracle);

      // Choosing a learner
      learner = loadLearner(learningMethod, sulOracle, alphabet);
    }

    private static EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> loadTester(
        TestingMethod testMethod, SUL<String, String> sul, MembershipOracle.MealyMembershipOracle<String, String> sulOracle) {
      switch (testMethod) {
        // simplest method, but doesn't perform well in practice, especially for large models
        case RandomWalk:
          // RandomWalkEQOracle directly asks queries to the SocketSUL which circumvents currentAlphabet requests
          // leading to infinity learning loop
          return new RandomWalkEQOracle<>(sul, randomWalk_chanceOfResetting, randomWalk_numberOfSymbols, true, new Random(123456L));
        // Other methods are somewhat smarter than random testing: state coverage, trying to distinguish states, etc.
        case WMethod:
        case WpMethod:
        case UserQueries:
          throw new NotImplementedException("Test Method %s not implemented".formatted(testMethod));
        default:
          throw new RuntimeException("No test oracle selected!");
      }
    }

    private static ExtensibleLStarMealy<String, String> loadLearner(LearningMethod learningMethod, MembershipOracle.MealyMembershipOracle<String, String> sulOracle, Alphabet<String> alphabet) {
      switch (learningMethod) {
        case LStar:
          return new ExtensibleLStarMealyBuilder<String, String>().withAlphabet(alphabet).withOracle(sulOracle.asOracle()).create();
        case RivestSchapire:
        case TTT:
        case KearnsVazirani:
          throw new NotImplementedException("Learning Method %s not implemented.".formatted(learningMethod));
        default:
          throw new RuntimeException("No learner selected");
      }
    }
  }
}
