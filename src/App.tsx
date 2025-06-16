import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import {Card} from '@/components/ui/card'


function App() {
  return (
    <>
        <div class="flex items-center justify-center h-screen" >
          <div >
            <Card id='main-card'>
              <h1>M A C R O B L O G</h1>
              <p>hi</p>
              <Button id='resizable-button'>Read More</Button>
            </Card>
          </div>
        </div> 
        <div class="grid-bg"></div>
    </>
  )
}

export default App
