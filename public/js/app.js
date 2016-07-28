$(document).on("click", ".toggle-facets", function() {
    $(this).next(".extra-facets").removeClass("extra-facets");
    $(this).remove();
});