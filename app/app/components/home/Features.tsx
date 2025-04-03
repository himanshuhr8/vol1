import { ThumbsUp, Users, Youtube, AirplayIcon as Spotify } from "lucide-react";

export function Features() {
  return (
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Everything you need for collaborative music sessions
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            MusicRoom brings people together through music, no matter where they
            are.
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Collaborative Rooms</h3>
            <p className="text-muted-foreground">
              Create private or public rooms and invite friends to join your
              music session.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <div className="flex">
              <Youtube className="h-6 w-6 text-red-500" />
              <Spotify className="h-6 w-6 text-green-500 -ml-1" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Multiple Sources</h3>
            <p className="text-muted-foreground">
              Add songs from YouTube or Spotify with a simple link or search.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ThumbsUp className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Democratic Voting</h3>
            <p className="text-muted-foreground">
              Vote on songs to decide what plays next. The most popular tracks
              rise to the top.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
