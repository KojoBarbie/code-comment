import React from 'react'
import { Navbar } from 'react-bootstrap'

const Header = () => {
  return (
    <Navbar bg="primary" expand="lg">
        <Navbar.Brand href='/'>chatGPT App</Navbar.Brand>
    </Navbar>
  )
}

export default Header