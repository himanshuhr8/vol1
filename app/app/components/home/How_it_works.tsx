export function How_it_works() {
  return (
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Simple steps to get started
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get your collaborative playlist up and running in minutes.
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-3 md:gap-12">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
            1
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Create a Room</h3>
            <p className="text-muted-foreground">
              Start a new music room in seconds. Name it, set it to public or
              private.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
            2
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Invite Friends</h3>
            <p className="text-muted-foreground">
              Share your room code or link with friends so they can join your
              session.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
            3
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Add & Vote on Songs</h3>
            <p className="text-muted-foreground">
              Everyone adds songs and votes on their favorites to build the
              perfect playlist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
