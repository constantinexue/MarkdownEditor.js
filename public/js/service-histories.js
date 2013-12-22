// Browser module only
(function() {
    mde.HistoriesService = mde.EventEmitter.extend(function() {}).methods({
        updateHistories: function(newlyFile) {
            var histories = this.getHistories(),
                index = -1;
            if (_.isArray(histories)) {
                index = _.indexOf(histories, newlyFile);
                if (index !== -1) {
                    // Remove it firstly
                    histories = _.without(histories, newlyFile);
                }
            } else {
                histories = [];
            }
            // Add to the head
            histories.unshift(newlyFile);
            // Keep top 10
            histories = histories.slice(0, 10);
            this.setHistories(histories);
            this.fire('historiesChanged', histories);

            return when.resolve(histories);
        },
        getHistories: function() {
            var jsonString = localStorage.getItem('histories');
            try {
                var histories = JSON.parse(jsonString);
                return (_.isArray(histories)) ? histories : [];
            } catch (err) {
                localStorage.removeItem('histories');
                return [];
            }
        },
        setHistories: function(value) {
            var jsonString = JSON.stringify(value);
            localStorage.setItem('histories', jsonString);
            return this;
        }
    });
})();