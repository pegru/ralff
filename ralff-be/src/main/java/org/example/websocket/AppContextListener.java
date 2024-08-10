package org.example.websocket;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import org.example.automata.threading.TaskManager;

/**
 * Basic ServletContextListener for creating a TaskManager for executing asynchronous tasks
 * Takes care of properly shutting down running threads.
 */
@WebListener
public class AppContextListener implements ServletContextListener {
  @Override
  public void contextInitialized(ServletContextEvent sce) {
    // start TaskManager
    System.out.println("RALFF BE deployed to: " + sce.getServletContext().getContextPath());
    TaskManager.getInstance().start();
    ServletContextListener.super.contextInitialized(sce);
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    // shutdown TaskManager
    TaskManager.getInstance().shutdown();
    ServletContextListener.super.contextDestroyed(sce);
  }
}
