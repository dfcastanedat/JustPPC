package AbstractFactory;

public class ComedyAnimeFactory implements AnimeFactory {

    @Override
    public Anime crearAnime() {
        return new ComedyAnime();
    }

}
