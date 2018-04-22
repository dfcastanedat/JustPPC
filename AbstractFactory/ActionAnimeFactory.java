package AbstractFactory;

public class ActionAnimeFactory implements AnimeFactory {
    @Override
    public Anime crearAnime() {
        return new ActionAnime();
    }
}
