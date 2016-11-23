import React from 'react';
import { connect } from "react-redux";
import ReactPlayer from 'react-player'
import Duration from './Duration'
import screenfull from 'screenfull'
import { findDOMNode } from 'react-dom'
import VideoCam from 'material-ui/svg-icons/av/videocam';
import { blue500, red500, greenA200 } from 'material-ui/styles/colors';

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
                        //lilox: <VideoCam style={iconStyles} color={blue500} hoverColor={red500} /> :
                        <div /> :
                        <div>
                            <ReactPlayer
                                ref={player => { this.player = player } }
                                className='react-player'
                                width={480}
                                height={270}
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
                                style={{ width: '100%', height: '100% important!' }}
                                />

                            <table>
                                <tbody>
                                    <tr>
                                        <th>Controls</th>
                                        <td>
                                            <button onClick={this.stop}>Stop</button>
                                            <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                                            <button onClick={this.onClickFullscreen}>Fullscreen</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Seek</th>
                                        <td>
                                            <input
                                                type='range' min={0} max={1} step='any'
                                                value={played}
                                                onMouseDown={this.onSeekMouseDown}
                                                onChange={this.onSeekChange}
                                                onMouseUp={this.onSeekMouseUp}
                                                />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Volume</th>
                                        <td>
                                            <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Played</th>
                                        <td><progress max={1} value={played} /></td>
                                    </tr>
                                    <tr>
                                        <th>Loaded</th>
                                        <td><progress max={1} value={loaded} /></td>
                                    </tr>
                                    <tr>
                                        <th>duration</th>
                                        <td><Duration seconds={duration} /></td>
                                    </tr>
                                    <tr>
                                        <th>elapsed</th>
                                        <td><Duration seconds={duration * played} /></td>
                                    </tr>
                                    <tr>
                                        <th>remaining</th>
                                        <td><Duration seconds={duration * (1 - played)} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                }
            </div>
        );
    }

    onStart = () => {
        //lilox: console.log('onStart');
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
    onClickFullscreen = () => {
        screenfull.request(findDOMNode(this.player))
    }
}

export default connect((store) => ({
    video: store.player.video
}))(VideoPlayer);
