function filterLanguages() {
    var input, filter, ul, li, a, i;
    input = $('#languageSearchBar');
    filter = input.val().toLowerCase();
    ul = $("#languageChoice");
    li = $('#languageChoice > li');

    for (i = 0; i < li.length; i++) {
        a = li[i].firstChild;
        if (a.innerHTML.toLowerCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
