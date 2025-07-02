import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const UploadFileStack = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Chọn ảnh từ thư viện hoặc camera
  const selectImage = () => {
    Alert.alert(
      'Chọn ảnh',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thư viện', onPress: openImageLibrary },
        { text: 'Camera', onPress: openCamera },
      ]
    );
  };

  const openImageLibrary = () => {
    const options:any = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response:any) => {
      if (response.didCancel || response.error) {
        return;
      }
      
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const openCamera = () => {
    const options:any = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchCamera(options, (response:any) => {
      if (response.didCancel || response.error) {
        return;
      }
      
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

 

  // Upload file lên server
  const uploadFile = async (file:any, type = 'image') => {
    if (!file) {
      Alert.alert('Lỗi', 'Vui lòng chọn file trước khi upload');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      
      if (type === 'image') {
        //@ts-ignore
        formData.append('file', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.fileName || 'image.jpg',
        });
      } else {
        //@ts-ignore
        formData.append('file', {
          uri: file.fileCopyUri || file.uri,
          type: file.type,
          name: file.name,
        });
      }

      // Thay đổi URL này thành endpoint của server bạn
      const response = await fetch('https://your-server.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // Thêm authorization header nếu cần
          // 'Authorization': 'Bearer your-token',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Thành công', 'File đã được upload thành công!');
        console.log('Upload result:', result);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Lỗi', 'Không thể upload file. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>File Upload Demo</Text>

      {/* Image Selection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Ảnh</Text>
        
        <TouchableOpacity style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>Chọn Ảnh</Text>
        </TouchableOpacity>

        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            <Text style={styles.fileName}>{selectedImage.fileName}</Text>
            
            <TouchableOpacity 
              style={[styles.button, styles.uploadButton]} 
              onPress={() => uploadFile(selectedImage, 'image')}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Upload Ảnh</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  fileInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
});

export default UploadFileStack;