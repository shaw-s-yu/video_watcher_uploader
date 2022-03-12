import { getAPIURIWithPath } from "../utils";

export default function VideoWatcher() {
    return (
        <video id="videoPlayer" width="50%" controls>
            <source src={getAPIURIWithPath(['video'])} type="video/mp4" />
        </video>
    );
}