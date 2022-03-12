import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getAPIURIWithPath } from '../utils';
import { convertSecondsToDurationString, formatBytes, isFileVideo } from '../utils/FileUploaderUtils';

const Input = styled('input')({
  display: 'none',
});

const uploadFiles = async (formData:FormData) =>{
  const res = await fetch(
    getAPIURIWithPath(['upload']),
    {
      method: 'POST',
      body: formData,
    }
  )
  console.log(res);
}

export default function FileUploader() {
  const [fileStates, setFileStates] = useState<Array<{ file: File, lastModified: number, duration: number, isUploaded: boolean }>>([])
  useEffect(()=>{
    const uploadedCompleted = fileStates.filter(({isUploaded})=>!isUploaded).length===0;
    if(!uploadedCompleted || fileStates.length===0){
      return;
    }

    const formData = new FormData();
    const lastModifiedList:Array<number> = [];
    const durationList:Array<number> = [];

    fileStates.forEach(({file, lastModified, duration})=>{
      formData.append(`files`, file);
      lastModifiedList.push(lastModified);
      durationList.push(duration);
    })
    formData.append('last_modified', JSON.stringify(lastModifiedList));
    formData.append('durations', JSON.stringify(durationList));
    console.log(formData);
    uploadFiles(formData);

  }, [fileStates])
  
  
  return (
    <>
      <Input accept="*" multiple type="file" onChange={({ target }) => {
        if (target.files == null) {
          return;
        }
        setFileStates([...Object.values(target.files).map((file) => ({ file, lastModified: file.lastModified, duration: 0, isUploaded: !isFileVideo(file.name) }))])
      }} />
      <Button variant="contained" component="span">
        Upload
      </Button>
      {fileStates.map(({file, isUploaded}, index)=>{
        if(!isUploaded){
          const objUrl = URL.createObjectURL(file);
          return (<video preload='metadata' style={{display:'none'}} src={objUrl} key={index} onLoadedMetadata={(e):void=>{
            const newFileStates = fileStates.map(file=>({...file, duration:e.currentTarget.duration, isUploaded:true}))
            setFileStates([...newFileStates])
          }}/>)
        }else{
          return null;
        }
      })}
      <Grid container spacing={2} direction='column' style={{margin:36}}>
        <Grid container direction='row'>
          <Grid item xs={2}>File Name</Grid>
          <Grid item xs={2}>size</Grid>
          <Grid item xs={2}>Last Modified</Grid>
          <Grid item xs={2}>Duration</Grid>
          <Grid item xs={2}>Status</Grid>
        </Grid>
        {fileStates.map(({ file, lastModified, duration, isUploaded }, index) => {
          return <Grid container direction='row' key={index}>
            <Grid item xs={2}>{file.name}</Grid>
            <Grid item xs={2}>{formatBytes(file.size)}</Grid>
            <Grid item xs={2}>{new Date(lastModified).toDateString()}</Grid>
            <Grid item xs={2}>{convertSecondsToDurationString(duration)}</Grid>
            <Grid item xs={2}>{isUploaded?`Ready`:'Not Yet'}</Grid>
          </Grid>
        })}
      </Grid>
    </>
  );
}