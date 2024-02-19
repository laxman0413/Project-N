import React from 'react'
import "./Card.css"

function Card() {
  return (
    <div className='card'>
        
        <div className="card_header">
            <h3 className='card_header_comp'>Title</h3>
            <h5 className='card_header_comp'>Date</h5>
            <h5 className='card_header_comp'>Time</h5>    
        </div>
        <div className="card_body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <h5 className='card_body_comp'>Payment: </h5>
            <h5 className='card_body_comp'>Location: </h5>
            <h5 className='card_body_comp'>Work capacity: </h5>
        </div>
    </div> 
  )
}

export default Card