window.mvc.factory('dialogView', function() {
    return {
        promptToSave: function() {
            var deferred = when.defer();
            // Prompt to save change first
            bootbox.dialog({
                message: "You have changed the content, do you want to save it first?",
                title: "Prompt to save",
                closeButton: false,
                buttons: {
                    save: {
                        label: "Save it now",
                        className: "btn-success",
                        callback: function() {
                            deferred.resolve(true);
                        }
                    },
                    notsave: {
                        label: "Discard change",
                        className: "btn-danger",
                        callback: function() {
                            deferred.resolve(false);
                        }
                    },
                    cancel: {
                        label: "Cancel",
                        callback: function() {
                            deferred.reject();
                        }
                    }
                }
            });
            return deferred.promise;
        },
        promptInvalidHistory: function(history) {
            var deferred = when.defer();
            bootbox.dialog({
                message: "This file is no longer existed, it would be removed from histories list. \r\n" + history,
                title: "History file does not exist",
                closeButton: true,
                buttons: {
                    ok: {
                        label: "OK",
                        className: "btn-warning",
                        callback: function() {
                            deferred.resolve(true);
                        }
                    }
                }
            });
            return deferred.promise;
        }
    };
});