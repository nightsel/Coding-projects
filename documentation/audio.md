#  Audio Player & Lyrics Search

A **custom React audio player** featuring waveform visualization, clickable seek, and automatic lyrics fetching.  
Songs can be uploaded via SoundCloud links. Loading time depends on file size and network speed (typically under a minute).

---

##  Default Song

The default track **_*Luna - ST/A#R_** is preloaded from storage to speed up testing.  
It is used under the artist’s [guideline](https://www.ast-luna.com/guideline) — **non-commercial use, with credit to Luna**.

---

##  Audio Handling

Uploaded audio files are temporarily stored in [**Supabase Storage**](https://supabase.com/) under names like: `temp_audio_[uuid].mp3`

Files are **automatically deleted after 15 minutes**.

The backend runs on [**Render**](https://render.com/) and handles fetching and streaming audio files to the player.  

**Backend repository:** [nightsel/expressproject](https://github.com/nightsel/expressproject)

---

##  Waveform Visualization

- **Amplitude visualization** is simple to generate.
- **Frequency visualization** is more complex because human hearing emphasizes certain frequencies.  
  Low-frequency sounds can also create subtle overtones that are harder to hear.

I’ve fine-tuned the frequency visualization to better reflect my own hearing perception (I’m not an audio engineer though).

---

## Lyrics System

Lyrics are fetched from three public sources:

- [Lyrical Nonsense](https://www.lyrical-nonsense.com/)
- [UtaTen](https://utaten.com/)
- [LyricsTranslate](https://lyricstranslate.com/)

> Some songs may not be found or may have incomplete lyrics.  
> Lyrics are **not stored** anywhere.

### Features
-  Automatic scrolling (can be toggled off)  
-  Romaji lyric support (when available)  
-  Reset lyrics when a new song loads  

Fetching uses **HTML scraping** to identify the correct `<div>` for lyric content.  
For **UtaTen**, the internal search is used since URLs don’t follow a predictable pattern.  
Although scraping is used, traffic is minimal — equivalent to a single user browsing the site.

---

##  Technical Notes

- Built with **React**
- Hosted via **Render**
- File storage via **Supabase**
- Lyrics fetched dynamically from HTML responses
- Clean waveform rendering optimized for low CPU usage

---

##  Future Plans / TODO

-  Fetch lyrics **translations** (if available)  
-  Integrate **TextAlive API** for time-synced lyrics  
-  Dynamic background reacting to song “mood” or tone  
-  Improved frequency waveform visualization  
-  3D audio-reactive visualization mode  

---

##  Notes

This project is intended for **educational and non-commercial purposes only**.  
If you’re an artist or site owner and want your content removed or credited differently, feel free to contact me.

---
