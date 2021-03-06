import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';

import * as firebase from 'firebase';

const ForumIcon = ({ item, onPress, }) => {

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
        <Image
            style={styles.image}
            source={{ uri: item.forumImg ||
                'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
            }}
        />
        <Text style={styles.text}>
            {item.forumName}
        </Text>
    </TouchableOpacity>
  );
};

export default ForumIcon;

const styles = StyleSheet.create({
  container: {
    flex:0,
    width: 130,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'black',
  },
  text: {
    fontSize: 16,
    color: 'black',
  }
});