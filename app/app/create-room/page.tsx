import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CreateRoomPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="px-4 py-4 flex justify-end">
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create a Room</h1>
            <p className="text-muted-foreground">
              Set up your music room and invite friends to join
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input id="room-name" placeholder="Friday Night Vibes" />
            </div>
            <div className="space-y-2">
              <Label>Room Type</Label>
              <RadioGroup defaultValue="private" className="flex">
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="cursor-pointer">
                    Private
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="cursor-pointer">
                    Public
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Private rooms require a code to join. Public rooms can be
                discovered by anyone.
              </p>
            </div>
            <Button className="w-full" size="lg">
              Create Room
            </Button>
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
