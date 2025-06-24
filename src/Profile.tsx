import { useBlueskyAuth } from "./Auth/BlueskyAuthProvider";

export default function ProfilePage() {
    const { user, isLoading } = useBlueskyAuth();
    const shouldShowLoading = isLoading && !user;

    if (shouldShowLoading) {
        return <h1>Loading...</h1>;
    }

    
    if (user){
        return (
            <div> 
                <h1>{user.displayName}</h1>
            </div>
        );
    }
}

