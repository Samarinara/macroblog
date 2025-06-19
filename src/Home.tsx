import './App.css'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function HomePage() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleReadMore = () => {
    setIsAnimating(true)
    setTimeout(() => {
      window.location.href = '/search'
    }, 1) // Match animation duration
  }

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div>
          <Card
            id="main-card"
            className={`transition-transform duration-1000 ease-in-out ${isAnimating ? 'animate-slide-out' : ''}`}
          >
            <h1 className='slide-out'>M A C R O B L O G</h1>
            <h2>In a world full of micro blogging ... it's time to think BIG</h2>
            <Button
              id="resizable-button"
              onClick={handleReadMore}
              disabled={isAnimating}
            >
              Read More
            </Button>
          </Card>
        </div>
      </div>
      <div className="grid-bg"></div>
    </>
  )
}

export default HomePage
