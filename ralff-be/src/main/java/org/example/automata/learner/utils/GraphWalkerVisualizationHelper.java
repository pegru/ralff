package org.example.automata.learner.utils;

import net.automatalib.visualization.VisualizationHelper;

import java.util.HashMap;
import java.util.Map;

/**
 * CustomVisualizationHelper for generating unique label names that are required
 * if MBT is utilized with GraphWalker.
 *
 * @param <N>
 * @param <E>
 */
public class GraphWalkerVisualizationHelper<N, E> implements VisualizationHelper<N, E> {
  private final HashMap<String, Integer> labelIndexMap = new HashMap<>();

  @Override
  public boolean getNodeProperties(N n, Map<String, String> map) {
    return true;
  }

  @Override
  public boolean getEdgeProperties(N n, E e, N n1, Map<String, String> map) {
    if (map.containsKey("label")) {
      String label = map.get("label");
      Integer number = labelIndexMap.getOrDefault(label, 0);
      map.put("label", label + number);
      labelIndexMap.put(label, ++number);
    }
    return true;
  }
}
