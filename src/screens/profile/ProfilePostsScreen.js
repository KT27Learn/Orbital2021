import React from 'react';
import {
Text, Image, View, FlatList, SafeAreaView, StyleSheet, StatusBar, RefreshControl, TouchableOpacity, Alert
} from 'react-native';
import PostButton from '../../components/PostButton';
import PostCard from '../../components/PostCard';
import * as firebase from 'firebase';

export default class ProfilePostsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true,
            deleted: false,
            userId: firebase.auth().currentUser.uid,
        }
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = async () => {
      try {
        const list = [];
        this.setState({ refreshing: true });

        await firebase.firestore()
            .collection('posts')
            .doc(this.state.userId)
            .collection('userPosts')
            .orderBy('postTime', 'desc')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  userId,
                  postId,
                  post,
                  postImg,
                  postTime,
                  likeCount,
                  commentCount,
                } = doc.data();
                list.push({
                  id: doc.id,
                  userId,
                  userName: 'Test Name',
                  userImg:
                    'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                  postId,
                  postTime: postTime,
                  post,
                  postImg,
                  likeCount,
                  commentCount,
                });
              });
            });

        this.setState({ data: list });

        if (this.state.refreshing) {
          this.setState({ refreshing: false });
        }

        console.log('Posts: ', this.state.data);
      } catch (e) {
        console.log(e);
      }
    };

    handleDelete = (postId) => {
        Alert.alert(
          'Delete post',
          'Are you sure?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed!'),
              style: 'cancel',
            },
            {
              text: 'Confirm',
              onPress: () => this.deletePost(postId),
            },
          ],
          {cancelable: false},
        );
    };

    deletePost = (postId) => {
        console.log('Current Post Id: ', postId);

        firebase.firestore()
          .collection('posts')
          .doc(this.state.userId)
          .collection('userPosts')
          .doc(postId)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              const {postImg} = documentSnapshot.data();

              if (postImg != null) {
                const storageRef = firebase.storage().refFromURL(postImg);
                const imageRef = firebase.storage().ref(storageRef.fullPath);

                imageRef
                  .delete()
                  .then(() => {
                    console.log(`${postImg} has been deleted successfully.`);
                    this.deleteFirestoreData(postId);
                  })
                  .catch((e) => {
                    console.log('Error while deleting the image. ', e);
                  });
                // If the post image is not available
              } else {
                this.deleteFirestoreData(postId);
              }
            }
          });
    };

    deleteFirestoreData = (postId) => {
        firebase.firestore()
          .collection('posts')
          .doc(this.state.userId)
          .collection('userPosts')
          .doc(postId)
          .delete()
          .then(() => {
            Alert.alert(
              'Post deleted!',
              'Your post has been deleted successfully!',
            );
            this.setState({ deleted: true });
          })
          .catch((e) => console.log('Error deleting post.', e));
    };

    renderItemComponent = (data) =>
        <TouchableOpacity style={styles.container}>
            <Image style={styles.image} source={{ uri: data.item.url }} />
        </TouchableOpacity>

    ItemSeparator = () => <View style={{
        height: 2,
        backgroundColor: "rgba(0,0,0,0.5)",
        marginLeft: 10,
        marginRight: 10,
    }}
    />

    handleRefresh = () => {
        this.setState({ refreshing: false }, () => { this.fetchPosts() });
    }

    render() {
      const { navigation } = this.props;
      return (
        <SafeAreaView>
          <FlatList
            data={this.state.data}
            renderItem={({item}) => (
                <PostCard
                  item={item}
                  onDelete={this.handleDelete}
                  onViewProfile={() => alert('user profile')}
                  onPress={() => navigation.navigate('CommentScreen', {item})}
                />
            )}
//            renderItem={item => this.renderItemComponent(item)}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.ItemSeparator}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        </SafeAreaView>)
    }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 6,
  },
  image: {
    height: '100%',
    borderRadius: 4,
  },
});