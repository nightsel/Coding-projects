### Audio Player and Lyrics Search

This is a custom React audio player with a waveform visualizer and clickable seek. Songs can be uploaded from SoundCloud links. Loading audio should take less than a minute depending on file size and network speed.

The default song *Luna - ST/A#R* is pre-loaded from storage to save functionality testing time. It is used according to the artist’s [guideline](https://www.ast-luna.com/guideline) (non-commercial use, credit to **Luna given*).

Audio files you load are temporarily stored in [Supabase Storage](https://supabase.com/) under names like `temp_audio_[uuid].mp3` and are automatically deleted after 15 minutes.

The backend running on [Render](https://render.com/) handles fetching and streaming these audio files to your player. **Render server implementation is in the repository [expressproject](https://github.com/nightsel/expressproject)**.

Waveform amplitude is straightforward to implement. Waveform frequency is more complex, as humans perceive certain frequencies more strongly due to evolutionary factors. Low-frequency sounds can also generate overtones, creating high-frequency components that are harder to hear. I’ve made adjustments to the waveform frequency to better match my own perception, but I am not a professional audio engineer.

Lyrics are fetched from three websites — [Lyrical Nonsense](https://www.lyrical-nonsense.com/), [UtaTen](https://utaten.com/), and [LyricsTranslate](https://lyricstranslate.com/) — so some songs may not be found or may be incomplete. Lyrics are not saved anywhere.

Fetching is done via HTML scraping, manually identifying which <div> contains the relevant text. For UtaTen, the site’s search function is used to locate the best matching lyrics page because their URLs do not follow a consistent artist-song pattern. Normally, I would request permission, but this GitHub project does not significantly stress the site’s servers beyond what a single user would do.

todo: lyrics translation if available  
lyrics automatic scrolling when audio player timer progresses  
lyrics matching timer exactly with api like textalive app api (only works for songs with timed syllables in the database)  
add different background depending on what the song sounds like??
Frequency visualization improvement overall
audio visualization with 3d animation
