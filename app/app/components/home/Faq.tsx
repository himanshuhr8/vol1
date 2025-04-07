export function Faq() {
  return (
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Everything you need to know about MusicRoom.
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            Do I need an account to use MusicRoom?
          </h3>
          <p className="text-muted-foreground">
            No, you can create or join rooms without an account. However,
            creating an account lets you save your favorite rooms and track your
            music history.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Is MusicRoom free to use?</h3>
          <p className="text-muted-foreground">
            Yes, MusicRoom is completely free. We may introduce premium features
            in the future, but the core functionality will always remain free.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            How many people can join a room?
          </h3>
          <p className="text-muted-foreground">
            Each room can have up to 50 participants at once, making it perfect
            for parties, gatherings, or virtual hangouts.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            Do I need Spotify Premium to use MusicRoom?
          </h3>
          <p className="text-muted-foreground">
            No, you don&apos;t need Spotify Premium. MusicRoom plays music
            through YouTube and Spotify&apos;s web player, which works with free
            accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
