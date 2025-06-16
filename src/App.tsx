import './App.css'
import { Button } from '@/components/ui/button'
import {Card} from '@/components/ui/card'


function App() {
  return (
    <>
        <div className="flex items-center justify-center h-screen" >
          <div >
            <Card id='main-card'>
              <h1>M A C R O B L O G</h1>
              <p>hi</p>
              <Button id='resizable-button'>Read More</Button>
            </Card>
          </div>
        </div>
        <div className="grid-bg"></div>
    </>
  )
}

export default App
