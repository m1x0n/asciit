﻿CKEDITOR.dialog.add("simplelinkDialog", function (d) {
    return {
        allowedContent: "a[href,target]",
        title: "Insert Link",
        minWidth: 550,
        minHeight: 100,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [{
            id: "SimpleLink", label: "SimpleLink", elements: [{
                type: "text",
                label: "URL",
                id: "edp-URL",
                validate: CKEDITOR.dialog.validate.notEmpty("url cannot be empty."),
                setup: function (a) {
                    var a = a.getAttribute("href"), b = /^(http|https):\/\//;
                    a && (b.test(a) || (a = "http://" + a), this.setValue(a))
                },
                commit: function (a) {
                    var b = this.getValue(), c = /^(http|https):\/\//;
                    b && (c.test(b) || (b = "http://" + b), a.setAttribute("href", b), a.getText() || a.setText(this.getValue()))
                }
            }, {
                type: "text",
                label: "Text to display",
                id: "edp-text-display",
                setup: function (a) {
                    this.setValue(a.getText())
                },
                commit: function (a) {
                    var b = this.getValue();
                    "" !== b && null !== b && a.setText(b)
                }
            }, {
                type: "html",
                html: "<p>The Link will be opened in another tab.</p>"
            }]
        }],
        onShow: function () {
            var a = d.getSelection(), b = a.getStartElement(), c;
            b && (c = b.getAscendant("a", !0));
            !c || "a" != c.getName() ? (c = d.document.createElement("a"), c.setAttribute("target",
                "_blank"), a && c.setText(a.getSelectedText()), this.insertMode = !0) : this.insertMode = !1;
            this.element = c;
            this.setupContent(this.element)
        },
        onOk: function () {
            this.commitContent(this.element);
            this.insertMode && d.insertElement(this.element)
        }
    }
});