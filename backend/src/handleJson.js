const short_json = (big_json) => {
  new_json = {};
  new_json["total_songs"] = big_json["total"];
  new_json["songs"] = big_json["items"].map(item => {
    return {
      "name": item.track.name,
      "artist": item.track.artists[0].name,
      "spotify_url": item.track.external_urls.spotify,
      "api_url": item.track.href,
      "duration_ms": item.track.duration_ms,
    }
  }
  )
  return new_json;
}

export default short_json;
