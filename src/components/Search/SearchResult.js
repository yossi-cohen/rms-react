import React from 'react';
import { List } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import SearchResultItem from './SearchResultItem';
import VideoPlayer from '../Video/VideoPlayer';

export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const videoItems = this.props.videos.map((video) => {
            return <SearchResultItem key={video.vid} video={video} />
        });

        return (
            <Grid>
                <Row>
                    <Col xs={6} md={3}>
                        <List>
                            {videoItems}
                        </List>
                    </Col>
                    <Col>
                        <VideoPlayer />
                    </Col>
                </Row>
            </Grid>
        );
    }
}
