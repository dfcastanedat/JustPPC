package AbstractFactory;

public class IdolAnime implements Anime {

    @Override
    public void asignarProta() {
        System.out.println("Prota: Nico");
    }

    @Override
    public void indicarCaps() {
        System.out.println("Caps: 12");
    }

    @Override
    public void BecerrasApproves() {
        System.out.println("Becerra approves: 1");
    }

}
