import React from 'react';
import { UploadButton } from '~/app/utils/uploadthing';

const CustomUploadButton: React.FC = () => {
  return (
    <div className="relative w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center cursor-pointer">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        appearance={{
          button: "absolute inset-0 w-full h-full opacity-0",
          allowedContent: "hidden",
        }}
      />
      <svg id='Camera_24' width='90' height='90' viewBox='0 0 46 42' xmlns='http://www.w3.org/2000/svg'>
        <rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>
        <g transform="matrix(0.77 0 0 0.77 12 12)" >
          <path style={{ fill: 'rgb(0,0,0)' }} d="M 12.236328 4 C 11.478328 4 10.786266 4.4274688 10.447266 5.1054688 L 10.052734 5.8945312 C 9.7137344 6.5715313 9.0206719 7 8.2636719 7 L 4 7 C 2.895 7 2 7.895 2 9 L 2 22 C 2 23.105 2.895 24 4 24 L 26 24 C 27.105 24 28 23.105 28 22 L 28 9 C 28 7.895 27.105 7 26 7 L 21.736328 7 C 20.978328 7 20.286266 6.5725312 19.947266 5.8945312 L 19.552734 5.1054688 C 19.213734 4.4284687 18.520672 4 17.763672 4 L 12.236328 4 z M 6 5 C 5.448 5 5 5.448 5 6 L 8 6 C 8 5.448 7.552 5 7 5 L 6 5 z M 15 8 C 18.86 8 22 11.14 22 15 C 22 18.86 18.86 22 15 22 C 11.14 22 8 18.86 8 15 C 8 11.14 11.14 8 15 8 z M 24 9 C 24.552 9 25 9.448 25 10 C 25 10.552 24.552 11 24 11 C 23.448 11 23 10.552 23 10 C 23 9.448 23.448 9 24 9 z M 15 10 C 12.238576250846034 10 10 12.238576250846034 10 15 C 10 17.761423749153966 12.238576250846034 20 15 20 C 17.761423749153966 20 20 17.761423749153966 20 15 C 20 12.238576250846034 17.761423749153966 10 15 10 z" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default CustomUploadButton;
