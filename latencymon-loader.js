/**
 * Some require.js configurations
 */

requirejs.config({
    waitSeconds: 30,
    paths:{
        /* environment */
        "latencymon.env": window.atlas._widgets.latencymon.urls.env + "environment",
        "latencymon.env.utils": window.atlas._widgets.latencymon.urls.env + "utils",
        "latencymon.env.config": window.atlas._widgets.latencymon.urls.env + "config",
        "latencymon.env.params-manager": window.atlas._widgets.latencymon.urls.env + "ParamsManager",
        "latencymon.env.history-manager": window.atlas._widgets.latencymon.urls.env + "HistoryManager",
        "latencymon.env.languages.en": window.atlas._widgets.latencymon.urls.env + "languages/language.eng",

        /* libs */
        "latencymon.lib.jquery": window.atlas._widgets.latencymon.urls.libs + "jquery/jquery-1.11.1.min",
        "latencymon.lib.jquery-ui": window.atlas._widgets.latencymon.urls.libs + "jquery/jquery-ui.min",
        "latencymon.lib.tree-map": window.atlas._widgets.latencymon.urls.libs + "TreeMap",
        "latencymon.lib.date-format": window.atlas._widgets.latencymon.urls.libs + "dateFormat",
        "latencymon.lib.bootstrap": window.atlas._widgets.latencymon.urls.libs + "bootstrap/js/bootstrap.min",
        "latencymon.lib.socket-io": window.atlas._widgets.latencymon.urls.libs + "socket.io",
        "latencymon.lib.bootstrap-table": window.atlas._widgets.latencymon.urls.libs + "bootstrap-table/bootstrap-table.min",
        "latencymon.lib.jquery-amd": window.atlas._widgets.latencymon.urls.libs + "jquery-libs-amd",
        "latencymon.lib.jquery-libs": window.atlas._widgets.latencymon.urls.libs + "jquery-libs",
        "latencymon.lib.pathseg": window.atlas._widgets.latencymon.urls.libs + "pathseg",
        "latencymon.lib.d3-amd": window.atlas._widgets.latencymon.urls.libs + "d3/js/d3.v3.amd",
        "latencymon.lib.d3-magnetic-cursor": window.atlas._widgets.latencymon.urls.libs + "d3-magnetic-cursor",

        /* view */
        "latencymon.view.main": window.atlas._widgets.latencymon.urls.view + "MainView",
        "latencymon.view.chart.singleProbe": window.atlas._widgets.latencymon.urls.view + "ChartSingleProbeView",
        "latencymon.view.chart.multiProbe": window.atlas._widgets.latencymon.urls.view + "ChartMultiProbeView",
        "latencymon.view.chart.comparison": window.atlas._widgets.latencymon.urls.view + "ChartComparisonView",
        "latencymon.view.viewport": window.atlas._widgets.latencymon.urls.view + "ViewPort",
        "latencymon.view.chartManager": window.atlas._widgets.latencymon.urls.view + "ChartManager",
        "latencymon.view.templateManager": window.atlas._widgets.latencymon.urls.view + "TemplateManagerView",
        "latencymon.view.timeOverview": window.atlas._widgets.latencymon.urls.view + "TimeOverviewView",

        /* view.svg */
        "latencymon.view.svg.chart": window.atlas._widgets.latencymon.urls.view + "svg/SvgChartView",

        /* model*/
        "latencymon.model.group": window.atlas._widgets.latencymon.urls.model + "Group",

        /* controller */
        "latencymon.controller.gesture-manager": window.atlas._widgets.latencymon.urls.controller + "GesturesManager",
        "latencymon.controller.group-manager": window.atlas._widgets.latencymon.urls.controller + "GroupManager",
        "latencymon.controller.url-manager": window.atlas._widgets.latencymon.urls.controller + "UrlManager",
        "latencymon.controller.main": window.atlas._widgets.latencymon.urls.controller + "main",

        /* data manipulation */
        "latencymon.filter.relative-rtt": window.atlas._widgets.latencymon.urls.filter + "RelativeRTTFilter",
        "latencymon.filter.natural-rtt": window.atlas._widgets.latencymon.urls.filter + "NaturalRTTFilter",

        /* connector */
        "latencymon.connector.facade": window.atlas._widgets.latencymon.urls.connector + "ConnectorFacade",
        "latencymon.connector.history-auto": window.atlas._widgets.latencymon.urls.connector + "HistoryConnectorAutoResolution",
        "latencymon.connector.live": window.atlas._widgets.latencymon.urls.connector + "LiveConnector",
        "latencymon.connector.translate-to-ping": window.atlas._widgets.latencymon.urls.connector + "TranslateToPing",

        /* session */
        "latencymon.session.facade": window.atlas._widgets.latencymon.urls.session + "SessionManager"
    },
    shim:{

        "latencymon.lib.d3-magnetic-cursor": {
            deps: ["latencymon.lib.d3-amd"]
        },


        "latencymon.lib.socket-io": {
            exports: "io"
        },

        "latencymon.lib.jquery.cookie": {
            deps: ["latencymon.lib.jquery"]
        },

        "latencymon.lib.jquery-ui.timepicker": {
            deps: ["latencymon.lib.jquery-ui"]
        }
    }
});



define([
    "latencymon.env.utils",
    "latencymon.env.config",
    "latencymon.env.languages.en",
    "latencymon.lib.jquery-amd",
    "latencymon.controller.main"
], function(utils, config, language, $, main){

    var Latencymon = function(instance){
        var env, instanceParams, queryParams, parentDom, styleDownloads;

        /*
         * Access to the instance
         */
        instanceParams = instance.instanceParams;
        queryParams = instance.queryParams;
        parentDom = instance.domElement;

        /*
         * Init Dependency Injection Vector
         */
        env = {
            "version": "16.12.5.2",
            "widgetUrl": LATENCYMON_WIDGET_URL + "dev/",
            "autoStart": (instanceParams.autoStart != undefined) ? instanceParams.autoStart : config.autoStart,
            "dataApiResults": instanceParams.dataApiResults || config.dataAPIs.results,
            "dataApiMeta": instanceParams.dataApiMeta || config.dataAPIs.meta,
            "streamingUrl": instanceParams.streamingHost || config.streamingUrl,
            "syncWithRealTimeData": (instanceParams.syncWithRealTimeData != undefined) ? instanceParams.syncWithRealTimeData : config.syncWithRealTimeData,
            "autoStartGrouping": (instanceParams.autoStartGrouping != undefined) ? instanceParams.autoStartGrouping : config.autoStartGrouping,
            "groupingType": instanceParams.groupingType,
            "onlyChartMode": instanceParams.onlyChartMode,
            "onTimeRangeChange": instanceParams.onTimeRangeChange,
            "onTimeSelection": instanceParams.onTimeSelection,
            "permalinkEnabled": (instanceParams.permalinkEnabled != undefined) ? instanceParams.permalinkEnabled : config.permalinkEnabled,
            "groupingLabelReplace": (instanceParams.groupingLabelReplace != undefined) ? instanceParams.groupingLabelReplace : {},
            "parentDom": $(parentDom),
            "showMinimumByDefault": (instanceParams.showMinimumByDefault != undefined) ? instanceParams.showMinimumByDefault : config.showMinimumByDefault,
            "queryParams": queryParams
        };

        /*
         * Check if parent dom exists
         */
        if (!env.parentDom || env.parentDom.length == 0){
            throw "It was not possible to find the DOM element to populate";
        }


        /*
         * Check if stylesheets are loaded
         */

        if (!instanceParams.dev){
            styleDownloads = [
                // window.atlas._widgets.latencymon.urls.view + "css/style-compiled.css"
                window.atlas._widgets.latencymon.urls.view + "css/style-lib-dist.min.css"
                // window.atlas._widgets.latencymon.urls.libs + "bootstrap-datetimepicker.css"

            ];
        } else {

            styleDownloads = [
                window.atlas._widgets.latencymon.urls.view + "css/style.css",
                window.atlas._widgets.latencymon.urls.view + "css/bootstrap-datetimepicker.css",
                window.atlas._widgets.latencymon.urls.view + "css/jquery-ui.min.css",
                window.atlas._widgets.latencymon.urls.libs + "bootstrap/css/bootstrap.min.css",
                window.atlas._widgets.latencymon.urls.libs + "bootstrap/css/bootstrap-theme.min.css",
                window.atlas._widgets.latencymon.urls.libs + "bootstrap-table/bootstrap-table.min.css"
            ];

        }


        var objectToBeEnriched = {};

        utils.loadStylesheets(styleDownloads, function(){
            var n, length, methodName;

            env.main = new main(env);

            if (env.autoStart){
                env.main.init();
            }

            function enrichMethod(methodName) {
                objectToBeEnriched[methodName] = function () {
                    env.main[methodName].apply(env.main, arguments);
                }
            }

            for (n=0,length=env.main.exposedMethods.length; n<length; n++){
                methodName = env.main.exposedMethods[n];
                enrichMethod(methodName);
            }
        });


        /**
         * A set of methods exposed outside
         */
        return objectToBeEnriched;
    };

    return Latencymon;
});

