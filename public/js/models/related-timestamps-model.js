define(['app', 'moment'], function(App, moment) {
    App.module('App', function(Answer, App, Backbone, Marionette, $, _) {
        App.RelatedTimestampsModel = Backbone.Model.extend({
            attachLocalDates: function () {
                var updatedRelative = moment.utc(this.get('updated_at')).toDate();
                this.set('updated_relative', moment(updatedRelative).fromNow());

                var createdRelative = moment.utc(this.get('created_at')).toDate();
                this.set('created_relative', moment(createdRelative).fromNow());
            }
        });
    });
    return App.RelatedTimestampsModel;
});