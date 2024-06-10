import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import HomePage from './components/HomePage/HomePage';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import Browser from './components/Browse/Browser';
import GroupIdPage from './components/Groups/GroupIdPage';
import UpdateGroup from './components/Update/UpdateGroup';
import CreateGroup from './components/Create/CreateGroup';
import CreateEvent from './components/Create/CreateEvent';
import EventIdPage from './components/Events/EventIdPage';
import Footer from './components/Footer/Footer';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path:'/groups',
        element:<Browser/>
      },
      {
        path:'/events',
        element:<Browser/>
      },
      {
        path:'/events/:eventId',
        element:<EventIdPage/>
      },
      {
        path:'/groups/:groupId',
        element:<GroupIdPage/>
      },
      {
        path:'/groups/:groupId/edit',
        element:<UpdateGroup/>
      },
      {
        path:'/groups/create',
        element:<CreateGroup/>
      },
      {
        path:'/groups/:groupId/event/new',
        element:<CreateEvent/>
      }
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Footer/>
    </>
  );
}

export default App;
