from scraper.fybeca_scraper import ejecutar_fybeca
from scraper.cruzazul_scraper import ejecutar_cruzazul


def main():

    print("=" * 80)
    print("INICIANDO ACTUALIZACIÓN DE PRECIOS")
    print("=" * 80)

    print("\n")
    print("=" * 80)
    print("FYBECA")
    print("=" * 80)

    ejecutar_fybeca()

    print("\n")
    print("=" * 80)
    print("CRUZ AZUL")
    print("=" * 80)

    ejecutar_cruzazul()

    print("\n")
    print("=" * 80)
    print("ACTUALIZACIÓN FINALIZADA")
    print("=" * 80)


if __name__ == "__main__":
    main()