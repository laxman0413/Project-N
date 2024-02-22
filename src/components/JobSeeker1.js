import React from 'react'
import "./JobSeeker.css"
import Carder from './Carder'
import Menu from './Menu'
function JobSeeker() {
  return (
    <div>
      <Menu />
      <input type='text' placeholder='Search for jobs' className='search-bar' />
      <h3>Jobs Available </h3>
      <Carder />
      <Carder />
      <Carder />
    </div>
  )
}

export default JobSeeker