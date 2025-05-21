public class BoardGameQuery
{
    public string Username { get; set; }

    public int PlayerCount { get; set; }

    public bool HasBeenRated { get; set; }

    public BoardGameQuery(string username, int playerCount, bool hasBeenRated = false)
    {
        Username = username;
        PlayerCount = playerCount;
        HasBeenRated = hasBeenRated;
    }
}