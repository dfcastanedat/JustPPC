package AbstractFactory;

public class ComedyAnime implements Anime {

    @Override
    public void asignarProta() {
        System.out.println("Prota: Yuu");
    }

    @Override
    public void indicarCaps() {
        System.out.println("Caps: 24");
    }

    @Override
    public void BecerrasApproves() {
        System.out.println("Becerra approves: Yea");
    }
}
