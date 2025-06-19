import './App.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from "react";
import { fetchAtProtoProfile } from './ATProtoStuff/AccountDetailFetcher';

// Blog Search Page Component
function SearchPage() {
    function goHome(){
        window.location.href = '/home'
    }


  return (
<>
    <div className="flex flex-col gap-5 items-center justify-center align-top m-20">
        <h1>Search</h1>
        <div className='flex flex-row gap-20 items-center justify-center'>
            <Button onClick={goHome}>Home</Button>
        </div>
        <Input className='w-[50vw]' placeholder='Search for blogs...'></Input>
        <h2> _usernameTaken Blogs</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 items-center justify-center'>
            <ProfileCard handle={"samarinara.bsky.social"}></ProfileCard>

        </div>
    </div>
    <div className="grid-bg"></div>

</>
  )
}
interface HandleProp {
  handle: string;
}
async function fetchDisplayName({handle}: HandleProp) {
    const profile = fetchAtProtoProfile(handle);
    return (await profile).displayName;
}
async function fetchProfilePicture({handle}: HandleProp) {
    const profile = fetchAtProtoProfile(handle);
    return (await profile).avatar;
}


function ProfileCard({handle}: HandleProp) {
    const profilePromise = fetchDisplayName({handle});
    const profile = promiseMaker({myPromise: profilePromise});
    return (
        <Button className="grid grid-cols-1 gap-4 grid-rows-[2fr_1fr] items-center justify-center h-[20vh] w-[20vh] overflow-hidden">
        <div className="flex justify-center w-full">
            <ProfilePicture handle={handle} />
        </div>
        <h3>{profile}</h3>
        </Button>

    );
}

function ProfilePicture({handle}: HandleProp) {
    const profilePromise = fetchProfilePicture({handle});
    const avatar = promiseImageMaker({myPromise: profilePromise});
  return (
    <div className='w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-200'>
      {avatar ? (
        <img
          src={avatar.value}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        // fallback if no avatar
        <span className="text-gray-400">No Image</span>
      )}
    </div>
  );
}

function promiseMaker({ myPromise }: { myPromise: Promise<string | undefined> | undefined }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    myPromise?.then((val) => setValue(val ?? ""));
  }, [myPromise]);

  return <div>{value}</div>;
}

function promiseImageMaker({ myPromise }: { myPromise: Promise<string | undefined> | undefined }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    myPromise?.then((val) => setValue(val ?? ""));
  }, [myPromise]);

  return {value};
}

export default SearchPage