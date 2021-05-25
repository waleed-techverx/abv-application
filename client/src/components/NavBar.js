import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';



export default function NavBar() {
    return (
        <Nav>
          <NavMenu>
            <NavLink to="/profile">
              Profile
            </NavLink>
            <NavLink to="/account">
              Account
            </NavLink>
          </NavMenu>
          <NavBtn>
            <NavBtnLink to="/logout"> Logout</NavBtnLink>
          </NavBtn>
        </Nav>
    )
}
