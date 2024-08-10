package org.example.automata.learner;

import de.learnlib.algorithm.lstar.closing.ClosingStrategies;
import de.learnlib.algorithm.lstar.moore.ExtensibleLStarMoore;
import de.learnlib.algorithm.lstar.moore.ExtensibleLStarMooreBuilder;
import de.learnlib.oracle.EquivalenceOracle;
import de.learnlib.oracle.MembershipOracle;
import de.learnlib.oracle.equivalence.MooreRandomWordsEQOracle;
import de.learnlib.query.DefaultQuery;
import jakarta.websocket.EncodeException;
import net.automatalib.alphabet.Alphabet;
import net.automatalib.alphabet.GrowingMapAlphabet;
import net.automatalib.automaton.transducer.CompactMoore;
import net.automatalib.automaton.transducer.MooreMachine;
import net.automatalib.word.Word;
import org.example.RunConfig;
import org.example.automata.controller.BufferedMessageHandler;
import org.example.automata.learner.sul.moore.MooreOracleSUL;
import org.example.automata.learner.sul.moore.MooreSocketSUL;
import org.example.websocket.model.Command;
import org.example.websocket.model.Message;
import org.example.websocket.model.QueryType;
import org.example.websocket.model.config.LearnerConfig;

import java.io.IOException;
import java.util.Calendar;
import java.util.Collection;
import java.util.Random;

/**
 * Basic MooreLearner setup.
 * with sink state representation and filter for sink states
 *
 * @author Peter Grubelnik
 */
public class MooreLearner extends BasicLearner {
  private static final String FILE_NAME_EXTENSION = "moore";

  public MooreLearner(LearnerConfig learnerConfig, BufferedMessageHandler bufferedMessageHandler) {
    super(learnerConfig, FILE_NAME_EXTENSION, bufferedMessageHandler);
  }

  public void runMooreExperiment(
      MooreSocketSUL mooreSocketSUL,
      Collection<String> alphabet
  ) throws IOException, EncodeException {
    GrowingMapAlphabet<String> growingMapAlphabet = new GrowingMapAlphabet<>(alphabet);
    LearningMooreSetup learningMealySetup = new LearningMooreSetup(mooreSocketSUL, growingMapAlphabet);
    runMooreExperiment(learningMealySetup, growingMapAlphabet);
  }

  private void runMooreExperiment(LearningMooreSetup learnerSetup, Alphabet<String> alphabet) throws IOException, EncodeException {
    ExtensibleLStarMoore<String, String> learner = learnerSetup.learner;
    EquivalenceOracle<MooreMachine<?, String, ?, String>, String, Word<String>> eqOracle = learnerSetup.eqOracle;

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

          boolean success = produceOutput(MODEL_FILENAME + "-sink", learner.getHypothesisModel(), alphabet, true);
          if (success) {
            CompactMoore<String, String> filteredMoore = MooreFilter.pruneStatesWithOutput(learner.getHypothesisModel(), alphabet, RunConfig.SINK_OUTPUT);
            produceOutput(MODEL_FILENAME, filteredMoore, alphabet, true);
          }
          break;
        } else {
          // Counterexample found, rinse and repeat
          System.out.println("CE: " + ce);
          System.out.println("Member answer:\t" + ce.getOutput());
          System.out.println("Learner answer:\t" + learner.getHypothesisModel().computeSuffixOutput(ce.getPrefix(), ce.getSuffix()));
          System.out.println();

          // notify SUL Observer script that we start asking MQs again
          this.bufferedMessageHandler.send(new Message.Builder(Command.MESSAGE).withQueryType(QueryType.MQ).build());
          stage++;
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

  public static class LearningMooreSetup {
    public static int randomWordsMinLength = 2; // min word length
    public static int randomWordsMaxLength = 10; // max word length
    public static int randomWordsMaxTests = 100; // the number of words that is tested in total
    public final EquivalenceOracle<MooreMachine<?, String, ?, String>, String, Word<String>> eqOracle;
    public final ExtensibleLStarMoore<String, String> learner;

    public LearningMooreSetup(MooreSocketSUL mooreSocketSUL, Alphabet<String> alphabet) {
      MembershipOracle.MooreMembershipOracle<String, String> membershipOracle = new MooreOracleSUL(mooreSocketSUL, RunConfig.SINK_OUTPUT);
      eqOracle = new MooreRandomWordsEQOracle<>(membershipOracle, randomWordsMinLength, randomWordsMaxLength, randomWordsMaxTests, new Random(123456L));
      learner = new ExtensibleLStarMooreBuilder<String, String>()
          .withAlphabet(alphabet)
          .withOracle(membershipOracle)
          .withClosingStrategy(ClosingStrategies.CLOSE_SHORTEST).create();
    }
  }
}
