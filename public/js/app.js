/*global $*/
"use strict";

$(document).on("click", ".toggle-facets", function() {
    $(this).next(".extra-facets").removeClass("extra-facets");
    $(this).remove();
});

$(document).on("focusin", "input[data-hidden]", function() {
    this.type = "text";
});

$(document).on("focusout", "input[data-hidden]", function() {
    this.type = "password";
});

$(document).on("input", "input[data-id]", function(e) {
    if (!e.target.value) {
        return $(e.target).parents("tr")
            .addClass("has-error").removeClass("has-success");
    }

    $.ajax({
        url: window.location.href.replace("/create",
            "/" + e.target.value + "/json"),
        success: function() {
            $(e.target).parents("tr")
                .addClass("has-error").removeClass("has-success");
        },
        error: function() {
            $(e.target).parents("tr")
                .addClass("has-success").removeClass("has-error");
        },
    });
});

$(function() {
    $(".select2-select").select2({
        tags: true,
        allowClear: true,
    });
});
