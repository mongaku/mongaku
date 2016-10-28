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

$(function() {
    $(".select2-select").select2({
        tags: true,
    });
});
