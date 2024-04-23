import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContex';
import { useNavigate } from 'react-router-dom';

export default function Protect({ children, returnTo }) {
  const { user } = useUser();
  const [userChecked, setUserChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (returnTo) {
        navigate('/signin', { state: { returnTo } });
      } else {
        navigate('/signin');
      }
    } else {
      setUserChecked(true);
    }
  }, [navigate, user, returnTo]);

  return userChecked ? children : null;
}
