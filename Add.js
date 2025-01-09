import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const Add = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [isbn, setIsbn] = useState('');
    const [copies, setCopies] = useState('');
    const [image, setImage] = useState('');

    const saveBook = async () => {
        if (!title || !isbn || !copies || !image) {
            Alert.alert('Please fill all fields');
            return;
        }

        const newBook = { title, isbn, copies: parseInt(copies), image };
        let mydata = await AsyncStorage.getItem('bookdata');
        mydata = mydata ? JSON.parse(mydata) : [{ data: [] }];
        mydata[0].data.push(newBook);

        await AsyncStorage.setItem('bookdata', JSON.stringify(mydata));
        Alert.alert('Book added successfully!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    };

    const cancelAdd = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Add New Book</Text>

            <Text>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter book title"
            />

            <Text>ISBN:</Text>
            <TextInput
                style={styles.input}
                value={isbn}
                onChangeText={setIsbn}
                placeholder="Enter ISBN"
            />

            <Text>Copies:</Text>
            <TextInput
                style={styles.input}
                value={copies}
                onChangeText={setCopies}
                keyboardType="numeric"
                placeholder="Enter number of copies"
            />

            <Text>Image URL:</Text>
            <TextInput
                style={styles.input}
                value={image}
                onChangeText={setImage}
                placeholder="Enter image URL"
            />

            <TouchableOpacity style={styles.button} onPress={saveBook}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelAdd}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Add;
