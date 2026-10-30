import YouTubePlayer from './YouTubePlayer';

// Props: { course: object, playing: boolean, startSeconds: number, reloadKey: number, nextLesson?: object, onStartFacade: () => void, onVideoEnd?: () => void, onNextLesson?: () => void }
export default function Player({
  course,
  playing,
  startSeconds,
  reloadKey,
  nextLesson,
  onStartFacade,
  onVideoEnd,
  onNextLesson
}) {
  return (
    <YouTubePlayer
      course={course}
      playing={playing}
      startSeconds={startSeconds}
      reloadKey={reloadKey}
      nextLesson={nextLesson}
      onStartFacade={onStartFacade}
      onVideoEnd={onVideoEnd}
      onNextLesson={onNextLesson}
    />
  );
}
