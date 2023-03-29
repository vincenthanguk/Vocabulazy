import { useCallback } from 'react';

// -------------- USER AUTHENTICATION --------------

// LOGIN

// verify user token and refresh it
export const useVerifyUser = (userContext, setUserContext) => {
  const verifyUser = useCallback(() => {
    console.log(userContext);
    if (userContext.username === 'demoUser') {
      console.log('inside demoUser verifyUser');
      // return;
      setUserContext((oldValues) => {
        return { ...oldValues, token: 'demoUser' };
      });
      setTimeout(verifyUser, 5 * 60 * 1000);
    } else {
      fetch(process.env.REACT_APP_API_ENDPOINT + 'users/refreshToken', {
        method: 'POST',
        credentials: 'include',
        SameSite: 'none',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setUserContext((oldValues) => {
            return { ...oldValues, token: data.token };
          });
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, token: null };
          });
        }
        // call refreshToken every 5 minutes to renew the authentication token.
        setTimeout(verifyUser, 5 * 60 * 1000);
      });
    }
  }, [setUserContext, userContext.username]);

  return verifyUser;
};
