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
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const Edit = ({ navigation, route }) => {
    const { data, index } = route.params;

    const [title, setTitle] = useState(data.title);
    const [isbn, setIsbn] = useState(data.isbn);
    const [copies, setCopies] = useState(data.copies.toString());
    const [image, setImage] = useState(data.image);

    const saveChanges = async () => {
        try {
            let mydata = JSON.parse(await AsyncStorage.getItem('bookdata'));
            if (!mydata || !mydata[0] || !mydata[0].data) {
                Alert.alert('Data structure is invalid');
                return;
            }

            mydata[0].data[index] = { title, isbn, copies: parseInt(copies), image };

            await AsyncStorage.setItem('bookdata', JSON.stringify(mydata));
            Alert.alert('Changes saved!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (error) {
            console.error('Error saving changes:', error);
            Alert.alert('Failed to save changes');
        }
    };

    const deleteBook = async () => {
        Alert.alert('Are you sure?', '', [
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        let mydata = JSON.parse(await AsyncStorage.getItem('bookdata'));
                        if (!mydata || !mydata[0] || !mydata[0].data) {
                            Alert.alert('Data structure is invalid');
                            return;
                        }

                        mydata[0].data.splice(index, 1);

                        await AsyncStorage.setItem('bookdata', JSON.stringify(mydata));
                        Alert.alert('Book deleted!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
                    } catch (error) {
                        console.error('Error deleting book:', error);
                        Alert.alert('Failed to delete book');
                    }
                },
            },
            { text: 'No' },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Edit Book</Text>

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

            <TouchableOpacity style={styles.button} onPress={saveChanges}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteBook}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Edit;
