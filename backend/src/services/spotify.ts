function handleJson(response: any) {
  const { total, items } = response;
  const result = {
    total,
    songs: items.map((item: any) => ({
      name: item.track.name,
      artist: item.track.artists[0].name,
      spotifyUrl: item.track.external_urls.spotify,
      apiUrl: item.track.href,
      durationMs: item.track.duration_ms,
    })),
  };
  return result;
}

export default handleJson;
