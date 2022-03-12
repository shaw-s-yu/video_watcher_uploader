import { useState } from "react";


export default function useDurationFromFiles(files: Array<File>): null| Array<number> {
    const [fileStates, setFileStates] = useState<Array<{ duration: number, isCompleted: boolean }>>(files.map(_ => ({ duration: 0, isCompleted: false })));

    Object.keys(files).forEach((_, index) => {
        const file = files[index];
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            const newFileStates = fileStates.map(({ duration, isCompleted }, i) => i === index ? { duration: video.duration, isCompleted: true } : { duration, isCompleted })
            setFileStates([...newFileStates]);
        }

        video.src = URL.createObjectURL(file);;
    })
    const durationList = fileStates.filter(({isCompleted})=>isCompleted).map(({duration})=>duration);
    console.log(fileStates)
    if(durationList.length===0){
        return null;
    }else{
        return durationList;
    }
}