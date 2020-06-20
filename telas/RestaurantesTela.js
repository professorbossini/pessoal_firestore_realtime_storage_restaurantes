import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, TouchableWithoutFeedback } from 'react-native';

import ENV from '../env';
import * as firebase from 'firebase';
import 'firebase/firestore'

if (!firebase.apps.length) {
    firebase.initializeApp(ENV);
}

const firestore = firebase.firestore();
const restaurantesCollection = firestore.collection("restaurantes");


const RestaurantesTela = (props) => {

    const [restaurantes, setRestaurantes] = useState([]);

    useEffect(() => {
        restaurantesCollection.onSnapshot((collection) => {
            let aux = [];
            collection.docs.forEach(doc => {
                aux.push({
                    categoria: doc.data().categoria,
                    cidade: doc.data().cidade,
                    fotoURL: doc.data().fotoURL,
                    nome: doc.data().nome,
                    preco: doc.data().preco,
                    chave: doc.id,
                    avaliacaoMedia: doc.data().avaliacaoMedia,
                    qtdeAvaliacoes: doc.data().qtdeAvaliacoes
                });
            })
            setRestaurantes(aux);
        })
    }, []);


    return (
        <View style={estilos.container}>
            <FlatList
                data={restaurantes}
                renderItem={(restaurante) => (
                    <TouchableWithoutFeedback onPress={() => {
                        props.navigation.navigate('DetalhesRestauranteTela', { restaurante: restaurante })
                    }}>
                        <View
                            style={estilos.restauranteItemView}>
                            <Image
                                source={{ uri: restaurante.item.fotoURL }}
                                style={estilos.restauranteImage}
                            />
                            <Text style={estilos.nomeRestauranteText}>
                                {restaurante.item.nome}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                )}
                keyExtractor={restaurante => restaurante.chave}
            />
            <TouchableOpacity onPress={() => props.navigation.navigate('AdicionarRestauranteTela')} style={estilos.fab}>
                <Text style={estilos.iconeFab}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const estilos = StyleSheet.create({
    nomeRestauranteText: {
        fontSize: 16
    },
    restauranteItemView: {
        padding: 4,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        marginBottom: 4,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center'
    },
    restauranteImage: {
        width: '60%',
        height: 100,
        marginBottom: 8
    },
    container: {
        flex: 1,
        padding: 20
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: '#03A9F4',
        borderRadius: 30,
        elevation: 8
    },
    iconeFab: {
        fontSize: 20,
        color: 'white'
    }
});

export default RestaurantesTela;