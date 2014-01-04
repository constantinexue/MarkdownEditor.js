$('html').on('click', function() {
    parent.$('#' + window.name).trigger('click');
});

Mousetrap.bindGlobal(['mod+n', 'mod+o', 'mod+s', 'mod+shift+s'], function(e, combo) {
    this.parent.window.Mousetrap.trigger(combo);
    return false;
});