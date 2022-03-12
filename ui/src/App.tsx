import './App.css';
import FileUploader from './components/FileUploader.react';
import VideoWatcher from './components/VideoWatcher.react';

function App() {
  return (
    <div className="App">
      <FileUploader />
      <VideoWatcher />
    </div>
  );
}

export default App;
