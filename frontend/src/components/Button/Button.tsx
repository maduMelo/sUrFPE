import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'contained' | 'outlined';
    callToAction: string;
    icon?: string;
};

export const Button = ({ variant, callToAction, icon, ...props }: ButtonProps) => {


    return (

        <button
            {...props}
            className={
                ` flex justify-center gap-2 font-medium p-2 w-full rounded-lg cursor-pointer ${variant === 'contained' ? 
                    'text-white bg-[#224A68] hover:bg-[#2c5d83]' : 'text-[#224A68] border-2 hover:bg-[#2c5d8315]'} `
            }
        >   
            { callToAction }
            { icon && <span className="material-symbols-rounded"> {icon} </span> }
        </button>
    );
};