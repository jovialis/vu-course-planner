from tests.utils import initialize_app_for_testing

initialize_app_for_testing()


def test__warehouse_all():
    from src.warehousing.warehouse_all import warehouse_all

    # assert warehouse_all()


def test__warehouse_all_prerequisites():
    from src.warehousing.warehouse_all import warehouse_all_prerequisites

    # assert warehouse_all_prerequisites()
