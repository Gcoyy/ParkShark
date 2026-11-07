import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';
import Button from './Button';


const CameraScreen = ({ navigation }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  // const [mediaLibraryPermissionResponse, requestMediaLibraryPermissionResponse] = MediaLibrary.usePermissions();
  const [cameraProps, setCameraProps] = useState({
    zoom: 0,
    facing: 'front',
    flash: 'on',
    animateShutter: false,
    enableTorch: false
  });
  const [image, setImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);

  const cameraRef = useRef(null);

  // useEffect(() => {
  //   if(cameraPermission && cameraPermission.granted && mediaLibraryPermissionResponse && mediaLibraryPermissionResponse.status === 'granted') {
  //     fetchLastSavedImage();
  //   }
  // }, [cameraPermission, mediaLibraryPermissionResponse]);

  useEffect(() => {
    if (!cameraPermission) {
      requestCameraPermission();
    }
    // if (!mediaLibraryPermissionResponse) {
    //   MediaLibrary.requestMediaLibraryPermissionResponse();
    // }
  }, [cameraPermission]);

  if(!cameraPermission) {
    return <View />;
  }

  // if(cameraPermission.status === 'denied' || mediaLibraryPermissionResponse.status !== 'granted') {
  //   useCameraPermissions();
  //   MediaLibrary.requestPermissionsAsync();
  // }

  const toggleProperty = (prop, option1, option2) => {
    setCameraProps((current) => ({
      ...current,
      [prop]: current[prop] === option1? option2 : option1,
    }));
  };

  const takePicture = async () => {
    if(cameraRef.current) {
      try {
        const picture = await cameraRef.current.takePictureAsync();
        setImage(picture.uri);
        // console.log('Picture taken : ', image);
      } catch (err) {
        console.log('Error while taking picture : ', err)
      }
    }
  }

  // const savePicture = async () => {
  //   if(image) {
  //     try {
  //       const mediaLibraryPermissionResponse = await MediaLibrary.requestPermissionsAsync();
  //       if (mediaLibraryPermissionResponse.status === 'granted') {
  //         const asset = await MediaLibrary.createAssetAsync(image);
  //         const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
  //         setImage(null);
  //         getLastSavedImage();
  //         console.log('URi', previousImage);
  //         if (previousImage) {
  //           navigation.navigate('Input Report Details', { photo: previousImage });
  //         }
  //       } else {
  //         alert('Returning back to Home screen');
  //         navigation.navigate('User');
  //       }
  //     } catch (err) {
  //       console.log('Error while saving picture : ', err)
  //     }
  //   }
  // }

  // const getLastSavedImage = async () => {
  //   if(mediaLibraryPermissionResponse && mediaLibraryPermissionResponse.status === 'granted') {
  //     const dcimAlbum = await MediaLibrary.getAlbumAsync('DCIM');

  //     if(dcimAlbum) {
  //       const {assets} = await MediaLibrary.getAssetsAsync({
  //         album: dcimAlbum,
  //         sortBy: [[MediaLibrary.SortBy.creationTime, false]],
  //         mediaType: MediaLibrary.MediaType.photo,
  //         first: 1
  //       });
  //       console.log('Photo saved');

  //       if(assets.length > 0) {
  //         const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
  //         setPreviousImage(assetInfo.localUri || assetInfo.uri);
  //       } else {
  //         setPreviousImage(null);        
  //       }
  //     } else {
  //       setPreviousImage(null);
  //     }
  //   }
  // }


const savePicture = async () => {
  // console.log('Image:', image);
  if (image) {
    try {
      // const mediaLibraryPermissionResponse = await MediaLibrary.requestPermissionsAsync();
      // if (mediaLibraryPermissionResponse.status === 'granted') {
        // const asset = await MediaLibrary.createAssetAsync(image);
        // await MediaLibrary.getAssetInfoAsync(asset.id);
        // setImage(null);

        // Fetch the last saved image
        // await fetchLastSavedImage();

        // Navigate only if a valid image is retrieved
        // if (previousImage) {
          navigation.navigate('Input Report Details', { photo: image });
        // }
      // } else {
      //   alert('Returning back to Home screen');
      //   navigation.navigate('Home');
      // }
    } catch (err) {
      console.log('Error while saving picture:', err);
    }
  }
};

// const fetchLastSavedImage = async () => {
//   try {
//     const dcimAlbum = await MediaLibrary.getAlbumAsync('DCIM');
//     if (dcimAlbum) {
//       const { assets } = await MediaLibrary.getAssetsAsync({
//         album: dcimAlbum,
//         sortBy: [[MediaLibrary.SortBy.creationTime, false]],
//         mediaType: MediaLibrary.MediaType.photo,
//         first: 1,
//       });

//       if (assets.length > 0) {
//         const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0].id);
//         setPreviousImage(assetInfo.localUri || assetInfo.uri);
//       } else {
//         setPreviousImage(null);
//       }
//     } else {
//       setPreviousImage(null);
//     }
//   } catch (error) {
//     console.log('Error fetching last saved image:', error);
//   }
// };


  return (
    <View style={styles.container}>
      {!image ? (
        <>
          <View style={styles.header}>
            <Button 
              icon={cameraProps.flash === 'on' ? 'flash-on' : 'flash-off'} 
              onPress={() => toggleProperty('flash', 'on', 'off')}
            />
            <Button 
              icon='animation' 
              color={cameraProps.animateShutter ? 'white' : '#404040'} 
              onPress={() => toggleProperty('animateShutter', true, false)}
            />
            <Button 
              icon={cameraProps.enableTorch ? 'flashlight-on' : 'flashlight-off'} 
              onPress={() => toggleProperty('enableTorch', true, false)}
            />
          </View>
          <CameraView 
            style={styles.camera} 
            zoom={cameraProps.zoom} 
            facing={cameraProps.facing} 
            flash={cameraProps.flash} 
            animateShutter={cameraProps.animateShutter} 
            enableTorch={cameraProps.enableTorch} 
            ref={cameraRef}
          />
          <View style={styles.bottomControlsContainer}>
            <View style={styles.previousImage}>
              {/* <Image 
                source={{uri:previousImage}}
                style={styles.previousImage}
              /> */}
            </View>
            <Button 
              icon='camera' 
              size={60} 
              style={{height: 60}} 
              onPress={takePicture}
            />
            <Button 
              icon='flip-camera-ios' 
              onPress={() => toggleProperty('facing', 'front', 'back')}
              size={40}
            />
          </View>
        </>
      ) : (
        <>
          <Image source={{uri:image}} style={styles.camera}/>
          <View style={styles.bottomControlsContainer}>
            <Button 
              icon='flip-camera-android' 
              onPress={() => setImage(null)}
            />
            <Button 
              icon='check' 
              onPress={savePicture}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
  },
  bottomControlsContainer: {
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // paddingLeft: '32%',
  },
  previousImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});