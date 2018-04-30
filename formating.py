for _ in range(int(input())):
    string = raw_input()
    lst = []
    """Boleanos para los caracteres anteriores o si cambia de tipo
    de caracter"""
    letras = True 
    numeros = True
    simbolos = True
    for c in string:
        if c == " ":
            continue
        if c.isalpha():
            """funcion para saber si un caracter esta entra la a y z"""
            if letras == False:
                lst.append(" ")
            letras = True
            numeros = False
            simbolos = False
        elif c.isdigit():
            """funcion para saber si un caracter es numero"""
            if numeros == False:
                lst.append(" ")
            letras = False
            numeros = True
            simbolos = False
        else:
            if simbolos == False:
                lst.append(" ")
            letras = False
            numeros = False
            simbolos = True
        lst.append(c)
    print("".join(lst))
