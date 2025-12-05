import fs from "fs";
import bcrypt from "bcryptjs";
import connectDB from "../src/lib/db.js";

import User from "../src/lib/models/user-model.js";
import Song from "../src/lib/models/song-model.js";
import Playlist from "../src/lib/models/playlist-model.js";

export default async function fillCollections() {
  await connectDB();

  console.log("\nLoading PlaylisterData.json...");
  const raw = fs.readFileSync(new URL("./PlaylisterData.json", import.meta.url), "utf-8");
  const data = JSON.parse(raw);

  const { users, playlists } = data;

  console.log(`Raw users: ${users.length}`);
  console.log(`Raw playlists: ${playlists.length}`);

  function parseName(name) {
    const parts = name.split(/(?=[A-Z])/);
    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" ")
      };
    }
    return {
      firstName: name,
      lastName: "User"
    };
  }

  console.log("\nSeeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const userDocs = users.map(u => {
    const { firstName, lastName } = parseName(u.name);
    return {
      firstName,
      lastName,
      email: u.email,
      passwordHash: hashedPassword
    };
  });

  const insertedUsers = await User.insertMany(userDocs);
  console.log(`Inserted users: ${insertedUsers.length}`);

  const emailToUser = {};
  insertedUsers.forEach(u => emailToUser[u.email] = u);
  console.log("\nSeeding songs + playlists...");

  let totalSongsInserted = 0;

  for (const pl of playlists) {
    const owner = emailToUser[pl.ownerEmail];
    if (!owner) continue; // Skip if playlist owner does not exist

    const songIds = [];

    for (const song of pl.songs) {
      if (!song.youTubeId || song.youTubeId.trim() === "") {
        console.log(`Skipping bad song (missing youTubeId): ${song.title}`);
        continue;
      }

      const newSong = await Song.create({
        title: song.title,
        artist: song.artist,
        year: song.year,
        youtubeId: song.youTubeId,
        creator: owner._id
      });

      songIds.push(newSong._id);
      totalSongsInserted++;
    }

    await Playlist.create({
      name: pl.name,
      ownerEmail: pl.ownerEmail,
      published: false,
      listeners: [],
      listens: 0,
      songs: songIds
    });
  }

  console.log(`Inserted songs: ${totalSongsInserted}`);
  console.log(`Inserted playlists: ${playlists.length}`);

  console.log("\nFill complete.\n");
}
