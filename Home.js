import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { datasource } from './Data.js';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 5,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    bookImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
        marginRight: 10,
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const Home = ({ navigation }) => {
    const [mydata, setMydata] = useState([]);

    const getData = async () => {
        try {
            let datastr = await AsyncStorage.getItem('bookdata');
            if (datastr != null) {
                const jsondata = JSON.parse(datastr);
                setMydata(jsondata);
            } else {
                setMydata(datasource); // Default data if nothing is in storage
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getData);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                navigation.navigate('Edit', { index, data: item });
            }}
        >
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: item.image }} style={styles.bookImage} />
                <View style={styles.bookInfo}>
                    <Text style={styles.text}>{item.title}</Text>
                    <Text style={styles.text}>ISBN: {item.isbn}</Text>
                    <Text style={styles.text}>Copies: {item.copies}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.headerText}>Book List</Text>
            <FlatList
                data={mydata[0]?.data} // All books are in a single section now
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        let datastr = JSON.stringify(mydata);
                        navigation.navigate('Add', { datastring: datastr });
                    }}
                >
                    <Text style={styles.buttonText}>Add New Book</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Home;
