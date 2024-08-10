package org.example.automata.learner.sul.mealy;

import de.learnlib.sul.StateLocalInputSUL;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * SUL-wrapper to check for non-determinism, by use of an observation tree.
 * Sources from basic-learning: <a href="https://gitlab.science.ru.nl/ramonjanssen/basic-learning">https://gitlab.science.ru.nl/ramonjanssen/basic-learning</a>
 * last accessed 29.01.2024
 * Commit hash: 8b86aaeb946653141a3ba884f45ff9f0c73531b2
 *
 * @param <I>
 * @param <O>
 * @author Ramon Janssen
 */
public class NonDeterminismCheckingSUL<I, O> implements StateLocalInputSUL<I, O> {
  private final StateLocalInputSUL<I, O> sul;
  private final ObservationTree<I, O> root = new ObservationTree<I, O>();
  private final List<I> inputs = new ArrayList<>();
  private final List<O> outputs = new ArrayList<>();

  public NonDeterminismCheckingSUL(StateLocalInputSUL<I, O> sul) {
    this.sul = sul;
  }

  @Override
  public void pre() {
    this.sul.pre();
  }

  @Override
  public void post() {
    this.sul.post();
    // check for non-determinism: crashes if outputs are inconsistent with previous ones
    this.root.addObservation(inputs, outputs);
    this.inputs.clear();
    this.outputs.clear();
  }

  @Override
  public O step(I in) {
    O out = this.sul.step(in);
    this.inputs.add(in);
    this.outputs.add(out);
    return out;
  }

  @Override
  public Collection<I> currentlyEnabledInputs() {
    return this.sul.currentlyEnabledInputs();
  }
}
