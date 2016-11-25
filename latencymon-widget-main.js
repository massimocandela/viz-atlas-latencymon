/**
 * Some path configurations
 */

LATENCYMON_WIDGET_URL = ((typeof LATENCYMON_EXTERNAL_WIDGET_URL == 'undefined') ? "https://www-static.ripe.net/static/rnd-ui/atlas/static/measurements/widgets/latencymon/" : LATENCYMON_EXTERNAL_WIDGET_URL) ;

LATENCYMON_ENVIRONMENT_URL = LATENCYMON_WIDGET_URL + "dev/environment/";

LATENCYMON_LIB_URL = LATENCYMON_WIDGET_URL + "dev/libs/";
LATENCYMON_CONNECTOR_URL = LATENCYMON_WIDGET_URL + "dev/connector/";

LATENCYMON_MODEL_URL = LATENCYMON_WIDGET_URL + "dev/model/";
LATENCYMON_VIEW_URL = LATENCYMON_WIDGET_URL + "dev/view/";
LATENCYMON_CONTROLLER_URL = LATENCYMON_WIDGET_URL + "dev/controller/";
LATENCYMON_FILTER_URL = LATENCYMON_WIDGET_URL + "dev/filter/";

LATENCYMON_SESSION_URL = LATENCYMON_WIDGET_URL + "dev/session/";
LATENCYMON_CONFIG_URL = LATENCYMON_WIDGET_URL + "dev/";
LATENCYMON_UTIL_URL = LATENCYMON_WIDGET_URL + "dev/";

LATENCYMON_MAIN_URL = LATENCYMON_WIDGET_URL;


window.atlas = window.atlas || {}; // declare namespace
window.atlas.massimo = window.atlas.massimo || {};
window.atlas.massimo.latencymon = window.atlas.massimo.latencymon || {};
window.atlas.massimo.latencymon.instances = window.atlas.massimo.latencymon.instances || {
        requested: [],
        running: {},
        callbacks: {}
    };


if (!window.atlas.massimo.widgetInjectorRequested) { // Only one injector
    window.atlas.massimo.widgetInjectorLoaded = false;
    window.atlas.massimo.widgetInjectorRequested = true;
    window.atlas.massimo.latencymon.tmp_scripts = document.getElementsByTagName('script');
    window.atlas.massimo.latencymon.tmp_scrip = window.atlas.massimo.latencymon.tmp_scripts[window.atlas.massimo.latencymon.tmp_scripts.length - 1];
    window.atlas.massimo.injectorScript = document.createElement('script');
    window.atlas.massimo.injectorScript.async = false;
    window.atlas.massimo.injectorScript.src = LATENCYMON_LIB_URL + 'require.min.js';
    window.atlas.massimo.latencymon.tmp_scrip.parentNode.appendChild(window.atlas.massimo.injectorScript);
}




/**
 * This is the code of the widget system
 */
function initLatencymon(domElement, instanceParams, queryParams){
    var run;

    run = function(){
        var instances, instance, runLatencymon;

        instances = window.atlas.massimo.latencymon.instances;
        instance = instances.requested.shift();

        while (instance){
            (function(instances, instance){
                if (instance.instanceParams.dev) { // Load dev version
                    require([LATENCYMON_WIDGET_URL + 'latencymon-loader.js'], function(Latencymon){
                        instances.running[instance.domElement] = Latencymon(instance);
                    });
                } else { // Load deployed version
                    require([LATENCYMON_WIDGET_URL + 'latencymon-dist.js'], function () {
                        require(['latencymon-loader'], runLatencymon);
                    });
                }
            })(instances, instance);


            instance = instances.requested.shift();
        }
    };

    window.atlas.massimo.latencymon.instances.requested
        .push({domElement: domElement, instanceParams: instanceParams, queryParams: queryParams, callbacks: {}});


    if (window.atlas.massimo.widgetInjectorLoaded === false){
        window.atlas.massimo.injectorScript.onload = function(){
            window.atlas.massimo.widgetInjectorLoaded = true;
            run();
        };
    } else {
        run();
    }



    return {
        shell: function(){
            var instance = window.atlas.massimo.latencymon.instances.running[domElement];

            if (instance) {
                return instance;
            } else {
                throw "Widget not loaded yet. Try again in a few seconds."
            }
        }
    };
}
