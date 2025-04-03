import { Link, Music } from "lucide-react";

export function Fotter() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="flex items-center gap-2">
        <Music className="h-5 w-5" />
        <p className="text-sm font-medium">MusicRoom</p>
      </div>
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} MusicRoom. All rights reserved.
      </p>
    </footer>
  );
}
