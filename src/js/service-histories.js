// Browser module only
(function() {
    mde.HistoriesService = mde.EventEmitter.extend(function() {}).methods({
        updateHistories: function(file) {
            var histories = this.getHistories();
            histories = _.without(histories, file);
            // Add to the head
            histories.unshift(file);
            // Keep top 10
            histories = histories.slice(0, 10);
            this.setHistories(histories);
            this.fire('historiesChanged', histories);

            return when.resolve(histories);
        },
        deleteHistory: function(file) {
            var histories = this.getHistories();

            histories = _.without(histories, file);
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