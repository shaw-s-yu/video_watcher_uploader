import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';

export default function Upload() {
  // const [fileStates, setFileStates] = useState<
  //   Array<{
  //     file: Blob;
  //     lastModified: number;
  //     duration: number;
  //     isUploaded: boolean;
  //   }>
  // >([]);

  const selectFile = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    // DocumentPicker.
    const temp = res[0].uri.split('tmp/');
    console.log(temp)
    const res2 = await RNFS.readFile(`${RNFS.TemporaryDirectoryPath}${temp.pop()}`)
    console.log(res2);
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={selectFile}>
        <Text style={styles.buttonTextStyle}>Select File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
});
