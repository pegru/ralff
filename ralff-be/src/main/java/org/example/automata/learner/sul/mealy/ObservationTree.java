package org.example.automata.learner.sul.mealy;

import net.automatalib.word.Word;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Sources from basic-learning: <a href="https://gitlab.science.ru.nl/ramonjanssen/basic-learning">https://gitlab.science.ru.nl/ramonjanssen/basic-learning</a>
 * last accessed 29.01.2024
 * Commit hash: 8b86aaeb946653141a3ba884f45ff9f0c73531b2
 *
 * @param <I>
 * @param <O>
 * @author Ramon Janssen
 */
public class ObservationTree<I, O> {
  private final ObservationTree<I, O> parent;
  private final I parentInput;
  private final O parentOutput;
  private final Map<I, ObservationTree<I, O>> children;
  private final Map<I, O> outputs;

  public ObservationTree() {
    this(null, null, null);
  }

  private ObservationTree(ObservationTree<I, O> parent, I parentInput, O parentOutput) {
    this.children = new HashMap<>();
    this.outputs = new HashMap<>();
    this.parent = parent;
    this.parentInput = parentInput;
    this.parentOutput = parentOutput;
  }

  /**
   * @return The outputs observed from the root of the tree until this node
   */
  private List<O> getOutputChain() {
    if (this.parent == null) {
      return new LinkedList<O>();
    } else {
      List<O> parentChain = this.parent.getOutputChain();
      parentChain.add(parentOutput);
      return parentChain;
    }
  }

  private List<I> getInputChain() {
    if (this.parent == null) {
      return new LinkedList<I>();
    } else {
      List<I> parentChain = this.parent.getInputChain();
      parentChain.add(this.parentInput);
      return parentChain;
    }
  }

  /**
   * Add one input and output symbol and traverse the tree to the next node
   *
   * @param input
   * @param output
   * @return the next node
   * @throws RuntimeException
   */
  public ObservationTree<I, O> addObservation(I input, O output) throws RuntimeException {
    O previousOutput = this.outputs.get(input);
    boolean createNewBranch = previousOutput == null;
    if (createNewBranch) {
      // input hasn't been queried before, make a new branch for it and traverse
      this.outputs.put(input, output);
      ObservationTree<I, O> child = new ObservationTree<I, O>(this, input, output);
      this.children.put(input, child);
      return child;
    } else if (!previousOutput.equals(output)) {
      // input is inconsistent with previous observations, throw exception
      List<O> oldOutputChain = this.children.get(input).getOutputChain();
      List<O> newOutputChain = this.getOutputChain();
      List<I> inputChain = this.getInputChain();
      newOutputChain.add(output);
      throw new CacheInconsistencyException(toWord(inputChain), toWord(oldOutputChain), toWord(newOutputChain));
    } else {
      // input is consistent with previous observations, just traverse
      return this.children.get(input);
    }
  }

  /**
   * Add Observation to the tree
   *
   * @param inputs
   * @param outputs
   * @throws RuntimeException Inconsistency between new and stored observations
   */
  public void addObservation(Word<I> inputs, Word<O> outputs) throws RuntimeException {
    addObservation(inputs.asList(), outputs.asList());
  }

  public void addObservation(List<I> inputs, List<O> outputs) throws RuntimeException {
    if (inputs.isEmpty() && outputs.isEmpty()) {
      return;
    } else if (inputs.isEmpty() || outputs.isEmpty()) {
      throw new RuntimeException("Input and output words should have the same length:\n" + inputs + "\n" + outputs);
    } else {
      I firstInput = inputs.get(0);
      O firstOutput = outputs.get(0);
      try {
        this.addObservation(firstInput, firstOutput)
            .addObservation(inputs.subList(1, inputs.size()), outputs.subList(1, outputs.size()));
      } catch (CacheInconsistencyException e) {
        throw new CacheInconsistencyException(toWord(inputs), e.getOldOutput(), toWord(outputs));
      }
    }
  }

  public static <T> Word<T> toWord(List<T> symbolList) {
    return Word.fromList(symbolList);
  }
}
