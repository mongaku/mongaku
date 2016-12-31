/*global $*/
"use strict";

$(document).on("click", ".toggle-facets", function() {
    $(this).next(".extra-facets").removeClass("extra-facets");
    $(this).remove();
});

var updatePrivateDisplay = function() {
    var showPrivate = (localStorage.showPrivate === "true");
    $("html").toggleClass("revealed", showPrivate);
    $("input.toggle-private").prop("checked", showPrivate);
};

$(document).on("click", "input.toggle-private", function() {
    localStorage.showPrivate = this.checked;
    updatePrivateDisplay();
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
    $(".select2-select").each(function() {
        $(this).select2({
            tags: true,
            allowClear: $(this).data("placeholder"),
            minimumResultsForSearch: this.options.length > 10 ? 1 : Infinity,
        });
    });

    $(".select2-remote").each(function() {
        $(this).select2({
            allowClear: true,
            ajax: {
                url: "/" + $(this).data("record") + "/search",
                dataType: "json",
                data: function(params) {
                    return {
                        format: "json",
                        filter: (params.term || "") + "*",
                        page: params.page,
                    };
                },
                processResults: function(data) {
                    return {
                        results: data.records.map(function(record) {
                            return {
                                id: record._id,
                                // TODO: Generate real title
                                text: record.name,
                            };
                        }),
                    };
                },
                minInputLength: 3,
            },
        });
    });

    var $form = $("form[data-validate]");

    if ($form.length > 0) {
        setInterval(function() {
            $form.find("input[type=submit]")
                .attr("disabled", $form.find(".has-error").length > 0);
        }, 100);
    }

    updatePrivateDisplay();
});
