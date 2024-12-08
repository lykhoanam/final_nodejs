import React from "react";

function CardAnalysis() {
  return (

        <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none !flex-row flex-grow items-center rounded-[20px]">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white ">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-[#422afb]"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M4 9h4v11H4zM16 13h4v7h-4zM10 4h4v16h-4z"></path>
                </svg>
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">Earnings</p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              $340.5
            </h4>
          </div>
        </div>
   
  );
}

export default CardAnalysis;
