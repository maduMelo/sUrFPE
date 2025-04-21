import { ReactElement } from "react";


interface ChartContainerProps {
    title: string;
    description: string;
    children: ReactElement;
    width: 22 | 45 | 92;
};

export const ChartContainer = ({ title, description, children, width }: ChartContainerProps) => {


    return (
        <div
            className="flex flex-col p-4 rounded-3xl bg-white"
            style={{ width: width+"vw" }}
        >
            <h1 className="text-[#84332F] text-[18px] font-medium">
                {title}
            </h1>
            <p className="flex text-[#464646]">
                {description}
            </p>
            <div className="flex flex-wrap items-center justify-center w-fit">
                {children}
            </div>
        </div>
    );
};