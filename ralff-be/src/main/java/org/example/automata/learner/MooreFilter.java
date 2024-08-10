package org.example.automata.learner;

import net.automatalib.alphabet.Alphabet;
import net.automatalib.automaton.transducer.CompactMoore;
import net.automatalib.automaton.transducer.MooreMachine;
import net.automatalib.automaton.transducer.MutableMooreMachine;
import net.automatalib.common.util.mapping.Mapping;
import net.automatalib.util.automaton.copy.AutomatonCopyMethod;
import net.automatalib.util.automaton.copy.AutomatonLowLevelCopy;
import net.automatalib.util.automaton.predicate.TransitionPredicates;

import java.util.Arrays;
import java.util.Collection;
import java.util.function.Predicate;

public class MooreFilter {
  @SafeVarargs
  public static <I, O> CompactMoore<I, O> pruneStatesWithOutput(MooreMachine<?, I, ?, O> in,
                                                                Alphabet<I> inputs,
                                                                O... outputs) {
    return pruneStatesWithOutput(in, inputs, Arrays.asList(outputs));
  }

  public static <I, O> CompactMoore<I, O> pruneStatesWithOutput(MooreMachine<?, I, ?, O> in,
                                                                Alphabet<I> inputs,
                                                                Collection<? super O> outputs) {
    return filterByOutput(in, inputs, o -> !outputs.contains(o));
  }

  public static <I, O> CompactMoore<I, O> filterByOutput(MooreMachine<?, I, ?, O> in,
                                                         Alphabet<I> inputs,
                                                         Predicate<? super O> outputPred) {
    CompactMoore<I, O> out = new CompactMoore<>(inputs);
    filterByOutput(in, inputs, out, outputPred);
    return out;
  }

  public static <S1, T1, S2, I, O> Mapping<S1, S2> filterByOutput(MooreMachine<S1, I, T1, O> in,
                                                                  Collection<? extends I> inputs,
                                                                  MutableMooreMachine<S2, I, ?, O> out,
                                                                  Predicate<? super O> outputPred) {
    return AutomatonLowLevelCopy.copy(AutomatonCopyMethod.DFS, in, inputs, out, s -> outputPred.test(in.getStateOutput(s)), TransitionPredicates.alwaysTrue());
  }
}
