import { Button } from "@/components/ui/button";
import {
  Music,
  Users,
  ThumbsUp,
  Play,
  PlusCircle,
  Youtube,
  AirplayIcon as Spotify,
} from "lucide-react";

export function Home() {
  return (
    <div className="mx-auto lg:mx-0 relative">
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
      <div className="relative bg-card dark:bg-card/80 border rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b bg-muted/50 dark:bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span className="font-medium">Friday Night Vibes</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">8 people</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-background dark:bg-background/50 rounded-lg border">
              <div className="w-10 h-10 rounded bg-muted dark:bg-muted/50 flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Daft Punk - Get Lucky</p>
                <p className="text-xs text-muted-foreground">
                  Added by Alex • 3:45
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">12</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border">
              <div className="w-10 h-10 rounded bg-muted dark:bg-muted/30 flex items-center justify-center">
                <Youtube className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  The Weeknd - Blinding Lights
                </p>
                <p className="text-xs text-muted-foreground">
                  Added by Jamie • 3:20
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">8</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border">
              <div className="w-10 h-10 rounded bg-muted dark:bg-muted/30 flex items-center justify-center">
                <Spotify className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Billie Eilish - bad guy</p>
                <p className="text-xs text-muted-foreground">
                  Added by Taylor • 3:14
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">5</span>
              </div>
            </div>

            <div className="flex items-center justify-center p-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
                disabled
              >
                <PlusCircle className="h-3 w-3" />
                Add a song
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
