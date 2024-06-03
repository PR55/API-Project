import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
// import { newGroup } from '../../store/group';
import { CiGlobe } from "react-icons/ci";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  // const dispatch = useDispatch();

  // async function onClick(e){
  //   e.preventDefault();

  //   return await dispatch(newGroup({
  //     name:'chuck e cheese',
  //     about:'A fun place for kids to play under adult supervision. The animatronics are totally not haunted!',
  //     type:'In person',
  //     privat:true,
  //     city:'Salisbury',
  //     state:'Maryland',
  //     imageUrl:'https://cdn.vox-cdn.com/thumbor/cnGRP-qotm1r6WWg40Z57ZtmD0Q=/0x0:5224x3648/1200x800/filters:focal(1948x2277:2782x3111)/cdn.vox-cdn.com/uploads/chorus_image/image/73061903/1827753654.0.jpg'
  //   })).catch(async (res) => {
  //     let data = await res.json();
  //     if(data?.errors){
  //       console.log(data.errors);
  //     }
  //   })

  // }

  return (
    <div id='navBar'>
      <NavLink to="/"><CiGlobe size={96}/></NavLink>
      {/* <button onClick={onClick}>Fire test event</button> */}
      {isLoaded && (
        <ProfileButton user={sessionUser} />
      )}
    </div>
  );
}

export default Navigation;
