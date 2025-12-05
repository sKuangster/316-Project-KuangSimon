import connectDB from "../src/lib/db.js";
import User from "../src/lib/models/user-model.js";
import Song from "../src/lib/models/song-model.js";
import Playlist from "../src/lib/models/playlist-model.js";

export default async function clearCollections() {
  await connectDB();

  console.log("Clearing Users...");
  await User.deleteMany({});

  console.log("Clearing Songs...");
  await Song.deleteMany({});

  console.log("Clearing Playlists...");
  await Playlist.deleteMany({});

  console.log("Collections cleared.");
}
