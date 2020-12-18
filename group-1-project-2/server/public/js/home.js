$(document).ready(function() {
    $("input").change(function() {
        $("#searchform").submit();
    });
    $("select").change(function() {
        $("#searchform").submit();
    });
});