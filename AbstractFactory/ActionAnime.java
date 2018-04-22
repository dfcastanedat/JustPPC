package AbstractFactory;

public class ActionAnime implements Anime {

    @Override
    public void asignarProta() {
        System.out.println("Naruto");
    }

    @Override
    public void indicarCaps() {
        System.out.println("Caps: 50, Relleno: 45");
    }

    @Override
    public void BecerrasApproves() {
        System.out.println("Becerra approves: Yea");
    }

}
