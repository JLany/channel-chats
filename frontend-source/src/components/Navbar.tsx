import { Link, useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { UserIcon } from './UserIcon'
import { logout, selectCurrentUsername } from '@/features/auth/authSlice'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const username = useAppSelector(selectCurrentUsername)
  const navigate = useNavigate();

  const isLoggedIn = !!username

  let navContent: React.ReactNode = null

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(logout());
      navigate('/');
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {username}
          <button className="button small" onClick={onLogoutClicked}>
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <nav>
      <section>
        <h1>Channels Messaging</h1>
        {navContent}
      </section>
    </nav>
  )
}