package org.example.automata.learner.sul.mealy;

import de.learnlib.oracle.MembershipOracle;
import de.learnlib.query.Query;
import de.learnlib.sul.StateLocalInputSUL;
import net.automatalib.word.Word;
import net.automatalib.word.WordBuilder;

import java.util.Collection;
import java.util.Collections;

/**
 * MealySULOracle. Basically a copy of StateLocalInputSUL{@see de.learnlib.oracle.membership.StateLocalInputSUL} but allows customization
 *
 * @author Peter Grubelnik
 */
public class MealyOracleSUL implements MembershipOracle.MealyMembershipOracle<String, String> {

  private final StateLocalInputSUL<String, String> sul;
  private final String undefinedOutput;

  public MealyOracleSUL(StateLocalInputSUL<String, String> sul, String undefinedOutput) {
    this.sul = sul;
    this.undefinedOutput = undefinedOutput;
  }

  public void processQueries(Collection<? extends Query<String, Word<String>>> queries) {
    for (Query<String, Word<String>> query : queries) {
      Word<String> output = this.answerQuery(query.getPrefix(), query.getSuffix());
      query.answer(output);
    }
  }

  public Word<String> answerQuery(Word<String> prefix, Word<String> suffix) {
    try {
      this.sul.pre();
      Collection<String> enabledInputs = this.sul.currentlyEnabledInputs();

      for (String sym : prefix) {
        if (enabledInputs.contains(sym)) {
          this.sul.step(sym);
          enabledInputs = this.sul.currentlyEnabledInputs();
        } else {
          // decline immediately if prefix is not possible
          return Word.fromLetter(this.undefinedOutput);
        }
      }

      WordBuilder<String> wb = new WordBuilder<>(suffix.length());

      for (String sym : suffix) {
        if (enabledInputs.contains(sym)) {
          String out = this.sul.step(sym);
          enabledInputs = this.sul.currentlyEnabledInputs();
          wb.add(out);
        } else {
          // answer further suffixes with 'sink'
          enabledInputs = Collections.emptySet();
          wb.add(this.undefinedOutput);
        }
      }

      return wb.toWord();
    } finally {
      this.sul.post();
    }
  }
}
