import Storeon = require("storeon");

declare namespace crossTab {
  interface Config {
    key?: string;
    filter?: (event: PropertyKey, data?: any) => boolean
  }
}

/**
 * Storeon module to sync state at different tabs of the browser
 * @param {Config} config The config object
 * @param {String} [config.key = 'storeon-crosstab'] Key to use in localstorage
 * @param {Filter} [config.filter] Callback to filter events.
 */
declare function crossTab<State = unknown>(
  config?: crossTab.Config
): Storeon.Module<State>;

export = crossTab;
