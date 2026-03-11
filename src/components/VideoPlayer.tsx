interface VideoPlayerProps {
  url: string;
  title?: string;
}

function getEmbedUrl(url: string): { type: "iframe" | "video"; src: string } {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "iframe",
      src: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // MP4 or other direct video
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return { type: "video", src: url };
  }

  // Default: try as iframe embed
  return { type: "iframe", src: url };
}

const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
  const { type, src } = getEmbedUrl(url);

  if (type === "video") {
    return (
      <div className="w-full overflow-hidden rounded-md border bg-muted">
        <video
          src={src}
          controls
          className="w-full aspect-video"
          title={title}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-md border bg-muted">
      <iframe
        src={src}
        title={title || "Video debate"}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
