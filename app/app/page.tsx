import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Music,
  Users,
  ThumbsUp,
  Play,
  PlusCircle,
  Youtube,
  AirplayIcon as Spotify,
  ArrowRight,
  Divide,
  Feather,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import { Authenticate_Button } from "./components/home/Authenticate_Button";
import { Faq } from "./components/home/Faq";
import { Fotter } from "./components/home/Fotter";
import { How_it_works } from "./components/home/How_it_works";
import { Features } from "./components/home/Features";
import { Home } from "./components/home/Home";

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Music className="h-6 w-6" />
          <span>MusicRoom</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            How It Works
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Authenticate_Button />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted dark:from-background dark:to-background dark:bg-dot-white/[0.2]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Share Music Together, Vote on What Plays Next
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create a room, invite friends, and build the perfect
                    playlist together. Add songs from YouTube or Spotify and
                    vote on what plays next.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/create-room">
                    <Button size="lg" className="gap-2">
                      Create a Room
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/join-room">
                    <Button size="lg" variant="outline" className="gap-2">
                      Join a Room
                      <Users className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <Home />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <Features />
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <How_it_works />
        </section>

        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <Faq />
        </section>
      </main>
      <Fotter />
    </div>
  );
}
