'use client';

import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';
import { NavButton, AuthButton, Logo } from './styles';
import { useAuth } from '../../contexts/authContext/page';
import { auth } from '../../../firebase';

const NavbarContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  borderRadius: '25px',
  border: '2px solid #ADD8E6',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  maxWidth: '100%',
  margin: '20px auto',
  height: '60px',
});

const LeftSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const RightSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const Navbar = () => {
  const { userLoggedIn, setCurrentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <Logo src="/groceries.svg" onClick={() => window.location.href = '/'} />
        <Link href="/mypantry" passHref>
          <NavButton>My Pantry</NavButton>
        </Link>
        <Link href="/recipes" passHref>
          <NavButton>Recipes</NavButton>
        </Link>
      </LeftSection>
      <RightSection>
        {!userLoggedIn ? (
          <>
            <Link href="/login" passHref>
              <AuthButton>Login</AuthButton>
            </Link>
            <Link href="/register" passHref>
              <AuthButton variant="contained" color="secondary">Sign Up</AuthButton>
            </Link>
          </>
        ) : (
          <Link href='/' passHref>
            <AuthButton onClick={handleLogout}>Log Out</AuthButton>
          </Link>
        )}
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;