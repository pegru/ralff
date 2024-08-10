package org.example.automata.learner.sul.moore;

import de.learnlib.oracle.MembershipOracle;
import de.learnlib.query.Query;
import net.automatalib.word.Word;
import net.automatalib.word.WordBuilder;

import java.util.Collection;
import java.util.Collections;

/**
 * Simple MooreOracleSUL based upon StateLocalInputSUL{@see de.learnlib.oracle.membership.StateLocalInputSUL}
 * <p>
 * Requires a basic understanding of Moore Machines.
 * Queries should be answered according to the semantics of state-output systems such as MooreMachines.
 * This means an input sequence of length n results in an output word of length n+
 * During the first learning round, the suffix will always hold only the empty string
 * State is well-defined over prefix-closed set
 */
public class MooreOracleSUL implements MembershipOracle.MooreMembershipOracle<String, String> {

  private final MooreSocketSUL sul;
  private final String undefinedOutput;

  public MooreOracleSUL(MooreSocketSUL sul, String undefinedOutput) {
    this.sul = sul;
    this.undefinedOutput = undefinedOutput;
  }

  @Override
  public void processQueries(Collection<? extends Query<String, Word<String>>> queries) {
    for (Query<String, Word<String>> q : queries) {
      Word<String> output = answerQuery(q.getPrefix(), q.getSuffix());
      q.answer(output);
    }
  }

  @Override
  public Word<String> answerQuery(Word<String> prefix, Word<String> suffix) {
    sul.pre();

    try {
      Collection<String> enabledInputs = sul.currentlyEnabledInputs();
      // Prefix execution
      for (String sym : prefix) {
        if (enabledInputs.contains(sym)) {
          sul.step(sym);
          enabledInputs = sul.currentlyEnabledInputs();
        } else {
          // decline immediately if prefix is not possible
          return Word.fromLetter(this.undefinedOutput);
        }
      }

      // at least request current state output
      WordBuilder<String> response = new WordBuilder<>();
      response.add(sul.currentStateOutput());

      WordBuilder<String> suffixWB = new WordBuilder<>(suffix.length() + 1);
      // Suffix execution - collect output of states
      for (String sym : suffix) {
        if (enabledInputs.contains(sym)) {
          suffixWB.add(sul.step(sym));
          enabledInputs = sul.currentlyEnabledInputs();
        } else {
          // decline further requests
          suffixWB.add(this.undefinedOutput);
          enabledInputs = Collections.emptySet();
        }
      }

      // concat valid input response
      response.addAll(suffixWB);
      return response.toWord();
    } finally {
      sul.post();
    }
  }
}
