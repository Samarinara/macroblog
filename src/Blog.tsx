import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAtProtoProfile } from './ATProtoStuff/AccountDetailFetcher';
import { fetchMacroblogPosts } from './ATProtoStuff/PostFetcher';

interface HandleProp {
  handle: string;
}

function usePromiseValue(myPromise: Promise<string | undefined> | undefined) {
  const [value, setValue] = useState("");
  useEffect(() => {
    let cancelled = false;
    myPromise?.then((val) => {
      if (!cancelled) setValue(val ?? "");
    });
    return () => {
      cancelled = true;
    };
  }, [myPromise]);
  return value;
}

function BlogPage() {
  const { handle } = useParams();
    const profilePromise = fetchDisplayName({ handle: handle as string });
    const displayName = usePromiseValue(profilePromise);

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

export default BlogPage;

async function fetchDisplayName({handle}: HandleProp) {
    const profile = fetchAtProtoProfile(handle);
    return (await profile).displayName;
}