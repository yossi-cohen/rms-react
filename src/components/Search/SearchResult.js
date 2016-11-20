import React from 'react';
import { List } from 'material-ui';
import VideoItem from './VideoItem';

export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const videoItems = this.props.videos.map((video) => {
            return <VideoItem key={video.vid} video={video} />
        });

        return (
            <List>
                {videoItems}
            </List>
        );
    }
}

// ===============================
//lilox: grid
// ===============================
// import React from 'react';
// import { GridList } from 'material-ui';
// import VideoItem from './VideoItem';

// const styles = {
//     root: {
//         width: '100%',
//         display: 'flex',
//         flexWrap: 'wrap',
//         justifyContent: 'space-around',
//     },
//     gridList: {
//         width: 400,
//         height: 350,
//         overflowY: 'auto',
//     },
// };

// export default class SearchResult extends React.Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         const videoItems = this.props.videos.map((video) => {
//             return <VideoItem key={video.vid} video={video} />
//         });

//         return (
//             <div style={styles.root}>
//                 <GridList
//                     cellHeight={180}
//                     style={styles.gridList}
//                     >
//                     {videoItems}
//                 </GridList>
//             </div>
//         );
//     }
// }
