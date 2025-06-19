import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAtProtoProfile } from './ATProtoStuff/AccountDetailFetcher';
import { fetchMacroblogPosts } from './ATProtoStuff/PostFetcher';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function BlogPage() {
  const { handle } = useParams();
    const profilePromise = fetchDisplayName({ handle: handle as string });
    const displayName = promiseMaker({myPromise: profilePromise}); // Assuming promiseMaker is defined elsewhere

  useEffect(() => {
    // Placeholder: Replace with real fetch logic
    // Example: fetch(`/api/blog/${contentId}`).then(...)
  }, [handle]);

  console.log(fetchMacroblogPosts(handle as string));

  return (
    <>
        <div className="flex flex-col gap-5 items-center justify-center align-top m-20">
            <h1>{displayName}</h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 items-center justify-center'>

            </div>
        </div>
        <div className="grid-bg"></div>
    </>
  );
}

interface HandleProp {
  handle: string;
}
async function fetchDisplayName({handle}: HandleProp) {
    const profile = fetchAtProtoProfile(handle);
    return (await profile).displayName;
}

function promiseMaker({ myPromise }: { myPromise: Promise<string | undefined> | undefined }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    myPromise?.then((val) => setValue(val ?? ""));
  }, [myPromise]);

  return <div>{value}</div>;
}



function LoginPopup() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="neutral" className="w-full">
          Login with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}




export default BlogPage;