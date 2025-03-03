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
  private final MooreSocketSUL mooreSocketSUL;

  public MooreLearner(LearnerConfig learnerConfig, BufferedMessageHandler bufferedMessageHandler, MooreSocketSUL mooreSocketSUL) {
    super(learnerConfig, FILE_NAME_EXTENSION, bufferedMessageHandler);
    this.mooreSocketSUL = mooreSocketSUL;
  }

  /**
   * Function tailored to produce output files for Moore Machine
   *
   * @param filenameSuffix  the suffix for the filename
   * @param hypothesisModel learned hypotheses
   * @param alphabet        input alphabet learned
   * @throws IOException if file can not be generated
   */
  protected void produceMooreOutput(String filenameSuffix, MooreMachine<?, String, ?, String> hypothesisModel,
                                    Alphabet<String> alphabet) throws IOException {
    String baseFilename = filenameSuffix.isBlank() ? MODEL_FILENAME : String.join(RunConfig.DELIMITER, MODEL_FILENAME,
                                                                                  filenameSuffix);
    String sinkFilename = baseFilename + "-sink";
    String stBaseName = filenameSuffix.isBlank() ? learnerConfig.getName() :
        learnerConfig.getName() + RunConfig.DELIMITER + filenameSuffix;
    String stFilename = String.join(RunConfig.DELIMITER, stBaseName, RunConfig.FILE_ST_MOORE_SUFFIX);
    if (super.produceOutput(sinkFilename, hypothesisModel, alphabet)) {
      CompactMoore<String, String> filteredMoore = MooreFilter.pruneStatesWithOutput(hypothesisModel, alphabet,
                                                                                     RunConfig.SINK_OUTPUT);
      super.produceOutput(baseFilename, filteredMoore, alphabet);
    }
    this.mooreSocketSUL.writeToFile(stFilename);
  }

  public void runMooreExperiment(
      Collection<String> alphabet
  ) throws IOException, EncodeException {
    GrowingMapAlphabet<String> growingMapAlphabet = new GrowingMapAlphabet<>(alphabet);
    LearningMooreSetup learningMealySetup = new LearningMooreSetup(mooreSocketSUL, growingMapAlphabet, this.learnerConfig);
    runMooreExperiment(learningMealySetup, growingMapAlphabet);
  }


  private void runMooreExperiment(LearningMooreSetup learnerSetup, Alphabet<String> alphabet) throws IOException,
      EncodeException {
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
          produceMooreOutput("", learner.getHypothesisModel(), alphabet);
          break;
        } else {
          // Counterexample found, rinse and repeat
          System.out.println("CE: " + ce);
          System.out.println("Member answer:\t" + ce.getOutput());
          System.out.println("Learner answer:\t" + learner.getHypothesisModel().computeSuffixOutput(ce.getPrefix(),
                                                                                                    ce.getSuffix()));
          System.out.println();
          if (learnerConfig.isSaveAllHypotheses()) {
            // store hypothesis as file
            produceMooreOutput(String.join(RunConfig.DELIMITER, RunConfig.INTERMEDIATE_HYPOTHESIS_FILENAME,
                                           Integer.toString(stage)), learner.getHypothesisModel(), alphabet);
          }
          // notify SUL Observer script that we start asking MQs again
          this.bufferedMessageHandler.send(new Message.Builder(Command.MESSAGE).withQueryType(QueryType.MQ).build());
          stage++;
          learner.refineHypothesis(ce);
        }
      }
    } catch (Exception e) {
      if (saveOnCrash) {
        produceMooreOutput("before-crash", learner.getHypothesisModel(), alphabet);
      }
      throw e;
    }
  }

  public static class LearningMooreSetup {
    public final int randomWordsMinLength; // min word length
    public final int randomWordsMaxLength; // max word length
    public final int randomWordsMaxTests; // the number of words that is tested in total
    public final EquivalenceOracle<MooreMachine<?, String, ?, String>, String, Word<String>> eqOracle;
    public final ExtensibleLStarMoore<String, String> learner;

    public LearningMooreSetup(MooreSocketSUL mooreSocketSUL, Alphabet<String> alphabet, LearnerConfig learnerConfig) {
      this.randomWordsMinLength = learnerConfig.getEqConfig().getRandomWordsMinLength();
      this.randomWordsMaxLength = learnerConfig.getEqConfig().getRandomWordsMaxLength();
      this.randomWordsMaxTests = learnerConfig.getEqConfig().getRandomWordsMaxTests();

      MembershipOracle.MooreMembershipOracle<String, String> membershipOracle = new MooreOracleSUL(mooreSocketSUL,
                                                                                                   RunConfig.SINK_OUTPUT);
      eqOracle = new MooreRandomWordsEQOracle<>(membershipOracle, randomWordsMinLength, randomWordsMaxLength,
                                                randomWordsMaxTests, new Random(123456L));
      learner = new ExtensibleLStarMooreBuilder<String, String>()
          .withAlphabet(alphabet)
          .withOracle(membershipOracle)
          .withClosingStrategy(ClosingStrategies.CLOSE_SHORTEST).create();
    }
  }
}
