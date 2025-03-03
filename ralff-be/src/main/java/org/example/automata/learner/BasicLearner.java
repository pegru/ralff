package org.example.automata.learner;

import net.automatalib.alphabet.Alphabet;
import net.automatalib.automaton.Automaton;
import net.automatalib.serialization.dot.GraphDOT;
import net.automatalib.visualization.dot.DOT;
import org.example.RunConfig;
import org.example.automata.controller.BufferedMessageHandler;
import org.example.automata.learner.utils.GraphWalkerVisualizationHelper;
import org.example.websocket.model.config.LearnerConfig;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

/**
 * BasicLearner abstract Learner.
 * Sources from basic-learning:
 * <a href="https://gitlab.science.ru.nl/ramonjanssen/basic-learning">https://gitlab.science.ru.nl/ramonjanssen/basic-learning</a>
 * last accessed 29.01.2024
 * Commit hash: 8b86aaeb946653141a3ba884f45ff9f0c73531b2
 *
 * @author Ramon Janssen
 * <p>
 * Enhanced with GraphWalker compatible model generation
 */
public abstract class BasicLearner {


  protected String MODEL_FILENAME; // extension .pdf is added automatically

  protected final LearnerConfig learnerConfig;
  protected final BufferedMessageHandler bufferedMessageHandler;

  public enum LearningMethod {
    LStar,
    RivestSchapire,
    TTT,
    KearnsVazirani
  }

  public enum TestingMethod {
    RandomWalk,
    WMethod,
    WpMethod,
    UserQueries
  }

  /**
   * For controlled experiments only: store every hypotheses as a file. Useful for 'debugging'
   * if the learner does not terminate (hint: the TTT-algorithm produces many hypotheses).
   */
  public static boolean saveAllHypotheses = false;
  public static boolean saveOnCrash = false;
  public static boolean generateGWModel = true;

  public BasicLearner(LearnerConfig learnerConfig, String fileNameExtension, BufferedMessageHandler bufferedMessageHandler) {
    this.learnerConfig = learnerConfig;
    this.MODEL_FILENAME = String.join("-", learnerConfig.getName(), fileNameExtension);
    this.bufferedMessageHandler = bufferedMessageHandler;
  }

  /**
   * Produces a dot-file and a PDF (if graphviz is installed)
   *
   * @param fileName  filename without extension - will be used for the .dot and .pdf
   * @param automaton the automaton to save in a file
   * @param alphabet  learned input alphabet
   * @throws FileNotFoundException if file can not be generated
   * @throws IOException           if file can not be generated
   */
  protected boolean produceOutput(String fileName, Automaton<?, String, ?> automaton, Alphabet<String> alphabet) throws FileNotFoundException, IOException {
    // check if environment variable is set
    if (RunConfig.OUTPUT_DIR == null) {
      System.out.println("Environment variable OUTDIR_ENV_VARIABLE not set.");
      return false;
    }

    // create output directory if it does not exist
    if (!Files.isDirectory(Path.of(RunConfig.OUTPUT_DIR))) {
      Files.createDirectories(Path.of(RunConfig.OUTPUT_DIR));
    }

    Path root = Paths.get(RunConfig.OUTPUT_DIR);
    String fullFileName = root.resolve(fileName).toString();

    PrintWriter dotWriter = new PrintWriter(fullFileName + ".dot");
    GraphDOT.write(automaton, alphabet, dotWriter);

    // dot file for graphwalker - edges get an id attached to distinguish them in a GW model
    if (generateGWModel) {
      PrintWriter dotGWWriter = new PrintWriter(fullFileName + "-gw" + ".dot");
      GraphDOT.write(automaton, alphabet, dotGWWriter, new GraphWalkerVisualizationHelper<>());
    }

    // add rankDir="LR" for better visualization
    addRankDir(fullFileName);

    try {
      // generate pdf
      File file = new File(fullFileName + ".dot");
      DOT.runDOT(file, "pdf", new File(fullFileName + ".pdf"));
      System.out.println("result written to " + file.getAbsolutePath());
      return true;
    } catch (Exception e) {
      System.err.println("Warning: Install graphviz to convert dot-files to PDF");
      System.err.println(e.getMessage());
    } finally {
      dotWriter.close();
    }
    return false;
  }

  private void addRankDir(String fullFileName) {
    // Expensive file overwrite as LearnLib's GraphDot.write method does not provide any
    // parameters to alter the node alignment
    try {
      Path filePath = Paths.get(fullFileName + ".dot");
      ArrayList<String> lines = new ArrayList<>(Files.readAllLines(filePath));
      lines.add(1, "\trankdir=\"%s\";\n".formatted(learnerConfig.getRankdir()));
      Files.write(filePath, lines);
    } catch (Exception e) {
      //ignore
    }
  }
}
