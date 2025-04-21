import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'contained' | 'outlined';
    callToAction: string;
};

export const Button = ({ variant, callToAction, ...props }: ButtonProps) => {


    return (

        <button
            {...props}
            className={
                `font-medium p-2 w-full rounded-lg cursor-pointer ${variant === 'contained' ? 
                    'text-white bg-[#224A68] hover:bg-[#2c5d83]' : 'text-[#224A68] border-2 hover:bg-[#2c5d8315]'} `
            }
        >
            { callToAction }
        </button>
    );
};