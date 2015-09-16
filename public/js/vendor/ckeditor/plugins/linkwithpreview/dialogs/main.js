'use strict';

CKEDITOR.dialog.add('linkWithPreviewDialog', function (editor) {
    return {
        allowedContent: 'a[href,target]',
        title: 'Insert Link',
        minWidth: 550,
        minHeight: 100,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents:[{
            id: 'LinkWithPreview',
            label: 'LinkWithPreview',
            elements: [
                {
                    type: 'html',
                    html: '<div id="link-preview-wrapper"><img id="link-preview-image"></div>'
                },
                {
                    type: 'text',
                    label: 'URL',
                    id: 'edp-URL',
                    validate: CKEDITOR.dialog.validate.notEmpty('url cannot be empty.'),
                    setup: function (element, definition) {
                        var href = element.getAttribute('href');
                        var isExternalURL = /^(http|https):\/\//;
                        if (href) {
                            if (!isExternalURL.test(href)) {
                                href = 'http://' + href;
                            }
                            this.setValue(href);
                        }

                        document.getElementById(this.domId)
                            .addEventListener('keyup', function (e) {
                                definition.restart(e);
                            });
                    },
                    commit: function (element) {
                        var href = this.getValue();
                        var isExternalURL = /^(http|https):\/\//;
                        if (href) {
                            if (!isExternalURL.test(href)) {
                                href = 'http://' + href;
                            }
                            element.setAttribute('href', href);
                            if (!element.getText()) {
                                element.setText(this.getValue());
                            }
                        }
                    }
                },
                {
                    type: 'text',
                    label: 'Text to display',
                    id: 'edp-text-display',
                    setup: function (element, definition) {
                        this.setValue(element.getText());
                    },
                    commit: function (element) {
                        var currentValue = this.getValue();
                        if (currentValue !== '' && currentValue !== null) {
                            element.setText(currentValue);
                        }
                    }
                }, 
                {
                    type: 'html',
                    html: '<p>The Link will be opened in another tab.</p>'
                }
            ]
        }],
        onShow: function () {
            var selection = editor.getSelection();
            var selector = selection.getStartElement();
            var element;

            if (selector) {
                element = selector.getAscendant('a', true);
            }

            if (!element || element.getName() !== 'a') {
                element = editor.document.createElement('a');
                element.setAttribute('target', '_blank');
                if (selection) {
                    element.setText(selection.getSelectedText());
                }
                this.insertMode = true;
            } else {
                this.insertMode = false;
            }
            this.element = element;
            this.preview = this.parts.contents.getElementsByTag('img');

            this.setupContent(this.element, this.definition);
        },
        onOk: function () {
            var dialog = this;
            var anchorElement = this.element;

            this.commitContent(this.element);

            if (this.insertMode) {
                var wrapper = editor.document.createElement('div');
                wrapper.$.id = 'link-preview-result-wrapper';
                wrapper.$.style.width = '100px';
                wrapper.$.style.margin = '0 auto';
                var image = editor.document.createElement('img');
                image.$.src = this.preview.$[0].src;
                image.$.style.width = '100%';
                wrapper.append(image);
                wrapper.append(this.element);
                editor.insertElement(wrapper);
            }
        },
        process: function (e) {
            this.dialog.preview.$[0].src = '/link-preview?url=' +
                encodeURIComponent(e.target.value);
        },
        restart: function (e) {
            if (this.timerId) {
                clearTimeout(this.timerId);
            }
            var self = this;
            this.timerId = setTimeout(function () {
                self.process(e);
            }, 1000);
        }
    };
});
