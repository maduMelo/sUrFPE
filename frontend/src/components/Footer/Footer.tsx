import logo from "../../assets/logo-white.png";
import Instagram from "../../assets/ig-icon.png";


export const Footer = () => {

    return (
        <footer
            className="flex items-center justify-between px-10 h-16 mt-[3rem] bg-[#224A68] text-white overflow-clip"
        >
            <img src={logo} alt="sUrFPE logo" className="w-[4rem]" />

            <div className="text-[12px]">
                sUrFPE {new Date().getFullYear()} © Todos os direitos reservados
            </div>

            <a 
                href="https://www.instagram.com/surfpe_" target="blank"
                className="hover:bg-white/20 rounded-md cursor-pointer"
            >
                <img src={Instagram} alt="sUrFPE logo" className="w-[2rem]" />
            </a>
        </footer>
    );
};