class ConsensusDecider:
    """
    Helps in deciding which value to select, given a bunch of potentially different options.
    Basically just picks the one that occurs the most, although it can take in a weighting
    which could be used to upweight more recently found values.
    """

    def __init__(self):
        self.values = {}
        self.value_map = {}

    def put(self, value, weight=1):
        """
        Puts a value into the Consensus Decider
        :param value: The value to record
        :param weight: Relative weight
        """

        value_str = str(value)
        if value_str not in self.values:
            self.values[value_str] = 0
            self.value_map[value_str] = value

        self.values[value_str] += weight

    def arbitrate(self):
        """
        Grabs all values from the map, picks the one with the most occurrences, returns it.
        """

        if len(self.values) == 0:
            return None

        # Grabs the key with the most recurrences and returns its non-stringifed value
        best_key = (sorted(self.values.items(), key=lambda item: item[1], reverse=True))[0][0]
        return self.value_map[best_key]

    def has_majority(self):
        """
        Checks whether any value has a majority in the arbitration
        :return: True IFF there is a value with >= 50% of total weight
        """

        total_val = sum(self.values.values())
        for value in self.values.values():
            if value >= total_val / 2:
                return True

        return False
