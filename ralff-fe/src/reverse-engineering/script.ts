import {RunConfig} from './run-config';
import {MyWebSocket} from './socket/my-web-socket';
import {VisualUtils} from "./utils/visual-utils";

export const init = () => {
  window.addEventListener('beforeunload', ev => {
    RunConfig.saveRunConfig();
  });
  RunConfig.loadRunConfig();
  MyWebSocket.setExecutor();
  MyWebSocket.createSocket();
  VisualUtils.createVisuals();
};