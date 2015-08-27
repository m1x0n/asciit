define([
    'app',
    'paginator',
    'models/model-mixins'
], function(App, PageableCollection, ModelMixins) {
    App.module('Answer', function(Answer, App, Backbone, Marionette, $, _) {
        Answer.Model = Backbone.Model.extend(
            _.extend(
                {},
                ModelMixins.RelativeTimestampsModel,
                ModelMixins.LiveModel,
                ModelMixins.Votable,
                {
                    defaults: {
                        'description': ''
                    },
                    validation: {
                        description: {
                            required: true,
                            msg: i18n.t('validation.required-field')
                        }
                    },
                    initialize: function (options) {
                        this.urlRoot = App.prefix + '/api/v1/questions/'
                        + options.question_id
                        + '/answers';

                        this.attachLocalDates();
                        this.on('change', this.attachLocalDates);

                        if (this.id) {
                            this.liveURI = 'entries/' + this.id;
                            this.startLiveUpdating();
                        }
                    }
                }
            )
        );

        Answer.Collection = Backbone.Collection.extend(
            _.extend({}, ModelMixins.LiveCollection, {
                model: Answer.Model,
                url: function () {
                    return App.prefix + '/api/v1/questions/'
                        + this.question_id
                        + '/answers';
                },
                initialize: function (options) {
                    this.liveURI = 'questions/' +
                        options.question_id + '/answers';
                    this.url = App.prefix + '/api/v1/' + this.liveURI;

                    this.startLiveUpdating();
                }
            })
        );

        Answer.CollectionByUser = PageableCollection.extend(
            _.extend({}, ModelMixins.LiveCollection, {
                model: Answer.Model,
                url: App.prefix + '/api/v1/answers-my',
                sortKey: 'updated_at',
                order: 'desc',

                comparator: function (model1, model2) {
                    var compareField = this.sortKey;

                    if (model1.get(compareField) > model2.get(compareField)) {
                        return -1; // before
                    } else if (
                        model2.get(compareField) > model1.get(compareField)
                    ) {
                        return 1; // after
                    } else {
                        return 0; // equal
                    }
                },
                state: {
                    firstPage: 1,
                    pageSize: 5
                },
                queryParams: {
                    currentPage: 'page',
                    pageSize: 'page_size',
                    orderBy: function () {
                        return this.sortKey;
                    },
                    sortedBy: 'desc'
                },
                initialize: function (options) {
                    this.sort();
                    this.liveURI = 'user/'
                        + App.User.Current.get('id')
                        + '/questions-answers';

                    this.startLiveUpdating();
                }
            })
        );

        var API = {
            getAnswers: function (question_id) {
                var answers = new Answer.Collection({question_id: question_id});
                var defer = $.Deferred();

                answers.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    }
                });

                return defer.promise();
            },

            addAnswer: function (model) {
                var defer = $.Deferred();

                if (!model.save([], {
                        wait: true,
                        success: function () {
                            defer.resolve(model);
                        },
                        error: function (model, xhr, options) {
                            var errors = JSON.parse(xhr.responseText);
                            defer.reject(errors);
                        }
                    }))
                {
                    defer.reject({
                        description: 'Server error, saving is impossible!'
                    });
                }

                return defer.promise();
            },
            
            answerCollectionByUser: function () {
                var questions = new Answer.CollectionByUser();
                var defer = $.Deferred();

                questions.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                return defer.promise();
            }
        };

        App.reqres.setHandler('answer:collection', function (question_id) {
            return API.getAnswers(question_id);
        });

        App.reqres.setHandler('answer:add', function (data) {
            return API.addAnswer(data);
        });

        App.reqres.setHandler('answer:my', function () {
            return API.answerCollectionByUser();
        });
    });
    return App.Answer;
});
