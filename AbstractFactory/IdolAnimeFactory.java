package AbstractFactory;

public class IdolAnimeFactory implements AnimeFactory {

    @Override
    public Anime crearAnime() {
        return new IdolAnime();
    }

}
