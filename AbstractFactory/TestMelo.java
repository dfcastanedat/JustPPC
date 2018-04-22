package AbstractFactory;
import java.util.*;

public class TestMelo{

    private static Scanner S = new Scanner(System.in);
    
    public static void main(String[] args) {
        int o;
        do{
            o = preguntarServicio();
            switch(o) {
                case 1:
                    usarServicio(new IdolAnimeFactory());
                    break;
                case 2:
                    usarServicio(new ComedyAnimeFactory());
                    break;
                case 3:
                    usarServicio(new ActionAnimeFactory());
                    break;
                case 4:
                    System.out.println("Cerrando programa.");
                    break;
                default:
                    System.out.println("Se ha ingresado una opción inválida.");
            }
            System.out.print("\n");
        }while(o!=4);
    }
    
    public static void usarServicio(AnimeFactory factory) {
        Anime servicio = factory.crearAnime();
        servicio.asignarProta();
        servicio.indicarCaps();
        servicio.BecerrasApproves();
    }
    
    public static int preguntarServicio() {
        System.out.print(
                "MENÚ DE OPCIONES\n"
              + "---- -- -------->\n"
              + "1. Solicitar anime Idol.\n"
              + "2. Solicitar anime Comedia.\n"
              + "3. Solicitar anime de Accion\n"
              + "4. Cerrar programa.\n"
              + "Seleccione opción: "
        );
        return Integer.parseInt( S.nextLine() );
    }
}
