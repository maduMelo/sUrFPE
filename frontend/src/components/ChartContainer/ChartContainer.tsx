import { ReactElement } from "react";


interface ChartContainerProps {
    title: string;
    description: string;
    children: ReactElement;
};

export const ChartContainer = ({ title, description, children }: ChartContainerProps) => {

    return (
        <div
            className="flex flex-col justify-between p-4 h-full w-full rounded-3xl bg-white"
        >
            <div>
                <h1 className="text-[#84332F] text-[18px] font-medium">
                    {title}
                </h1>
                <p className="flex text-[#464646] text-[15px]">
                    {description}
                </p>
            </div>
            <div className="flex flex-wrap h-full items-start justify-center w-fit">
                {children}
            </div>
        </div>
    );
};