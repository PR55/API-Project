import { FaGithub, FaLinkedin } from "react-icons/fa";
import './footer.css'

export default function Footer(){
    return (
        <div id='footer'>
            <h2>About me:</h2>
            <div id='externalLinks'>
                {/* <a href="">B</a> */}
                <a href='https://github.com/PR55' target='_blank' rel='noreferrer' className="external"><FaGithub size={32}/></a>
                <a href='https://www.linkedin.com/in/kyle-joel-flores/' target='_blank' rel='noreferrer' className="external"><FaLinkedin size={32}/></a>
            </div>
        </div>
    )
}
