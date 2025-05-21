using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Serialization;
using System.Xml.Linq;
using System.Text;
using System.IO;
using System;
using System.Collections.Generic;

public class BggService
{
    private readonly HttpClient _httpClient;

    public BggService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<BoardGame>> GetOwnedGamesAsync(BoardGameQuery query)
    {
        if (string.IsNullOrWhiteSpace(query.Username))
            return [];

        var url = $"https://boardgamegeek.com/xmlapi2/collection?username={query.Username}&own=1&stats=1&rated={query.HasBeenRated}";

        // Retry logic in case BGG says "processing"
        for (int attempt = 0; attempt < 5; attempt++)
        {
            using var responseStream = await _httpClient.GetStreamAsync(url);

            var doc = XDocument.Load(responseStream);
            var root = doc.Root;

            if (root?.Name == "message")
            {
                await Task.Delay(2000); // wait 2 seconds
                continue;
            }

            // If not processing, parse and return the data
            var serializer = new XmlSerializer(typeof(BggCollection));
            using var stringReader = new StringReader(doc.ToString());
            var result = (BggCollection?)serializer.Deserialize(stringReader);

            if (result is not null)
            {
                return result.Items.Where(item =>
                       item.MinPlayerCount.HasValue &&
                        item.MaxPlayerCount.HasValue &&
                        query.PlayerCount >= item.MinPlayerCount &&
                        query.PlayerCount <= item.MaxPlayerCount).ToList();
            }
        }

        return [];
    }
}