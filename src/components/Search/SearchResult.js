import React from 'react';
import { List } from 'material-ui';
import SearchResultItem from './SearchResultItem';
import VideoPanel from './VideoPanel';

export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const videoItems = this.props.videos.map((video) => {
            return <SearchResultItem key={video.vid} video={video} />
        });

        return (
            <div>
                <div className="searchResult" >
                    <List>
                        {videoItems}
                    </List>
                </div>
                <VideoPanel />
            </div>
        );
    }
}
