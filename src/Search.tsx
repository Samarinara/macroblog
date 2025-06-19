import './App.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


// Blog Search Page Component
function SearchPage() {
  return (
<>
    <div className="flex flex-col gap-5 items-center justify-center align-top m-20">
        <h1>Search</h1>
        <Input className='w-[50vw]' placeholder='Search for blogs...'></Input>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 items-center justify-center'>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
            <ProfileCard></ProfileCard>
        </div>
    </div>
    <div className="grid-bg"></div>

</>
  )
}

function ProfileCard() {
  return (
    <Button className="grid grid-cols-1 gap-4 grid-rows-[2fr_1fr_2fr] items-center justify-center h-[20vh] w-[20vh] overflow-hidden">
      <ProfilePicture />
      <div>name</div>
      <div>description</div>
    </Button>
  );
}


function ProfilePicture(){
    return(
        <div className='w-20 h-20 bg-gray-600 rounded-full'></div>
    )
}

export default SearchPage