import styles from './YouTubeEmbed.module.css';

// TODO: Consider accepting an `aspectRatio` prop
// or `width/height` props. At the moment, we hard-code the
// `aspect-ratio` to `16 / 9`.

// TODO: Consider accepting a `timestamp` so that we can
// resume + autoplay a video that has been closed.
export interface YouTubeEmbedProps {
  videoId?: string;
  title?: string;
  autoPlay?: boolean;
  allowFullscreen?: boolean;
}

const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/';

// TODO: Is there a fallback video we should play if the `videoId` is empty?
export function YouTubeEmbed({
  videoId = '',
  title = 'YouTube video player',
  autoPlay = false,
  allowFullscreen = false,
}: YouTubeEmbedProps) {
  const src = `${YOUTUBE_EMBED_URL}${videoId}?autoplay=${autoPlay ? 1 : 0}`;

  return (
    <div className={styles.YouTubeEmbed}>
      <iframe
        src={src}
        title={title}
        allowFullScreen={allowFullscreen ? true : undefined}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        frameBorder="0"
      />
    </div>
  );
}
