import './App.css'
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div id='bg'>
      <div id='circles' className='big'></div>
      <div id='abs'>
        <div id='circle' className='main'>
          <div id='logo'>
            <div id='logohover'>
              <h1><span id='cursor'>_</span>username<span id='red'>Taken</span></h1>
            </div>

            <div className='columns-container'>
              <button className='redbutton' onClick={() => {navigate('/creating')}}>Creating</button>
              <button className='bluebutton'onClick={() => {navigate('/securing')}}>Securing</button>
              <button className='greenbutton'onClick={() => {navigate('/learning')}}>Learning</button>

            </div>
          </div>
          <div id='circut'></div>
        </div>
        </div>
      </div>
  )
}


export default HomePage;