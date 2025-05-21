using System.Xml.Serialization;

[XmlRoot("items")]
public class BggCollection
{
    [XmlElement("item")]
    public List<BoardGame> Items { get; set; } = new();
}

public class BoardGame
{
    [XmlElement("name")]
    required public string Name { get; set; }

    [XmlElement("yearpublished")]
    required public int BggId { get; set; }

    [XmlElement("image")]
    public string? ImageUrl { get; set; }

    [XmlElement("thumbnail")]
    public string? ThumbnailUrl { get; set; }

    [XmlElement("stats")]
    public Stats? Stats { get; set; }


    [XmlIgnore]
    public int? MinPlayerCount => Stats?.MinPlayers;

    [XmlIgnore]
    public int? MaxPlayerCount => Stats?.MaxPlayers;

    [XmlIgnore]
    public int? PlayTime => Stats?.PlayTime;
}

public class Stats
{
    [XmlAttribute("minplayers")]
    public int MinPlayers { get; set; }

    [XmlAttribute("maxplayers")]
    public int MaxPlayers { get; set; }

    [XmlAttribute("minplaytime")]
    public int MinPlayTime { get; set; }

    [XmlAttribute("maxplaytime")]
    public int MaxPlayTime { get; set; }

    [XmlAttribute("playingtime")]
    public int PlayTime { get; set; }
}