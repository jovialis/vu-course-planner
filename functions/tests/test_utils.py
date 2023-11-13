from tests.utils import compare_lists


def test__compare_arrays():
    assert compare_lists([1, 2, 3], [3, 2, 1])
    assert not compare_lists([1, 2, 3], [3, 2])

    assert compare_lists([1, [2, 3, [4, 5]]], [[2, [4, 5], 3], 1])
    assert not compare_lists([1, [2, 4, [4, 5]]], [[2, [4, 5], 3], 1])


def test__lambda_passing():
    def myfunc(return_lambda):
        return return_lambda("CS 2201")

    assert myfunc(lambda x: True)
    assert not myfunc(lambda x: False)