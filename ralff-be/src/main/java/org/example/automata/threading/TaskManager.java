package org.example.automata.threading;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class TaskManager {
  private static final int THREAD_POOL_SIZE = 1;
  private static TaskManager instance;
  private ExecutorService executorService;

  public void start() {
    System.out.println("TaskManager: Creating FixedThreadPool of size " + THREAD_POOL_SIZE);
    this.executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
  }

  public Future<?> submitTask(Runnable task) {
    if (this.executorService == null) {
      System.err.println("TaskManager: unable to run task " + task.toString());
      System.err.println("TaskManager: Did you start the TaskManager instance?");
      return null;
    }

    return executorService.submit(task);
  }

  public void shutdown() {
    System.out.println("TaskManager: Shutting down ExecutorService.");
    executorService.shutdownNow();
  }

  public static TaskManager getInstance() {
    if (TaskManager.instance == null) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }
}
