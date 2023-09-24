class ConsensusDecider:
    """
    Helps in deciding which value to select, given a bunch of potentially different options.
    Basically just picks the one that occurs the most, although it can take in a weighting
    which could be used to upweight more recently found values.
    """

    def __init__(self):
        self.values = {}

    def put(self, value, weight=1):
        if value not in self.values:
            self.values[value] = 0
        self.values[value] += weight

    """
    Grabs all values from the map, picks the one with the most occurrences, returns it.
    """

    def arbitrate(self):
        if len(self.values) == 0:
            return None
        return (sorted(self.values.items(), key=lambda item: item[1], reverse=True))[0][0]
