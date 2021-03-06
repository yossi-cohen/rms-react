import React from 'react';
import { connect } from "react-redux";
import ReactPlayer from 'react-player'
import Duration from './Duration'
import { findDOMNode } from 'react-dom'

import RecordIcon from 'material-ui/svg-icons/file/cloud-circle';
import Blink from 'components/Util/Blink';
import {
    Subheader,
} from 'material-ui';

const iconStyles = {
    marginRight: 24
};

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            url: null,
            playing: false,
            volume: 0.8,
            played: 0,
            loaded: 0,
            duration: 0,
            youtubeConfig: { iframeParams: { fullscreen: 1 } },
            fileConfig: { iframeParams: { fullscreen: 1 } }
        }
    }

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
            playing: true
        })
    }

    componentWillReceiveProps(props) {
        this.load(null == props.video ? null : props.video.url);
    }

    render() {
        const {
            url, playing, volume,
            played, loaded, duration,
            soundcloudConfig,
            youtubeConfig,
            fileConfig
        } = this.state

        return (
            <div className="videoPlayer">
                {
                    null == url ?
                        <div /> :
                        <div>
                            <Subheader style={{ display: 'flex', alignItems: 'center' }}>
                                <span>Recording</span>
                                <RecordIcon color='red' />
                            </Subheader>
                            <ReactPlayer
                                ref={player => { this.player = player } }
                                className='react-player'
                                controls={true}
                                url={url}
                                playing={playing}
                                volume={volume}
                                soundcloudConfig={soundcloudConfig}
                                youtubeConfig={youtubeConfig}
                                fileConfig={fileConfig}
                                onReady={() => { this.onReady() } }
                                onStart={() => { this.onStart() } }
                                onPlay={() => this.setState({ playing: true })}
                                onPause={() => this.setState({ playing: false })}
                                onBuffer={() => { this.onBuffer() } }
                                onEnded={() => this.setState({ playing: false })}
                                onError={e => this.onError(e)}
                                onProgress={this.onProgress}
                                onDuration={duration => this.setState({ duration })}
                                />
                        </div>
                }
            </div>
        );
    }

    onStart = () => {
        //lilox: console.log('onStart');this.player
    }

    onReady = () => {
        //lilox: console.log('onReady');
    }

    onBuffer = () => {
        //lilox: console.log('onBuffer');
    }

    onError = (e) => {
        //lilox: console.log('onError', e);
    }

    playPause = () => {
        this.setState({ playing: !this.state.playing });
    }

    stop = () => {
        this.setState({ url: null, playing: false });
    }

    setVolume = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    onSeekMouseDown = e => {
        this.setState({ seeking: true })
    }

    onSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    onSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    onProgress = state => {
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }
}

export default connect((store) => ({
    video: store.player.video
}))(VideoPlayer);
