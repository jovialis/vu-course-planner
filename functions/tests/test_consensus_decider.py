

def test__consensus_deciders():
    from src.utils.consensus_decider import ConsensusDecider

    test1 = ConsensusDecider()
    test1.put("a", 1)
    test1.put("b", 1)
    test1.put("b", 1)
    assert test1.arbitrate() == "b"

    assert test1.has_majority()

    test2 = ConsensusDecider()
    test2.put("a", 3)
    test2.put("b", 1)
    test2.put("b", 1)
    assert test2.arbitrate() == "a"

    test2.put("b", 1)
    assert not test2.has_majority()
    test2.put("b", 1)
    assert test2.has_majority()

    test3 = ConsensusDecider()
    test3.put("a", 1000)
    assert test3.arbitrate() == "a"

    test4 = ConsensusDecider()
    test4.put("a", 1000)
    assert test4.has_majority()

    test4.put("b", 1000)
    test4.put("c", 1000)

    # assert not test4.has_majority()

    test5 = ConsensusDecider()
    assert test5.arbitrate() is None
    assert not test5.has_majority()


