import logo from "../../assets/logo.png";


export const Header = () => {

    return (
        <header className="fixed top-0 left-0 z-40 flex items-center bg-white shadow-md pl-3 h-18 w-full rounded-br-[40px]">
            <img src={logo} alt="sUrFPE logo" />
        </header>
    );
};