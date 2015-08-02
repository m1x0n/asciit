define(['marionette', 'bootstrap', 'validation-model'], function (Marionette) {
    var App = new Marionette.Application();

    App.addRegions({
        container: 'body'
    });

    App.addInitializer(function (options) {
        require(['views/main-layout'], function (layout) {
            App.container.show(layout);
            debugger;
        });
        debugger;
    });

    App.on('start', function () {
        require(['routes'], function () {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });
    });

    return App;
});