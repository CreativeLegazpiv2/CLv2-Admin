import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Login() {
  return (
    <Card className="w-full max-w-sm text-lg border border-slate-300 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Creatives Admin.</CardDescription>
      </CardHeader>
      <form action="">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            // onClick={(e) => e.preventDefault()}
            className="w-full hover:bg-slate-800 duration-300 transition-colors"
          >
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
