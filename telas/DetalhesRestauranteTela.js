import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Button, TextInput } from 'react-native';

import Modal, { ModalContent } from 'react-native-modals';


import * as firebase from 'firebase';
import 'firebase/firestore'


const firestore = firebase.firestore();
const restaurantesCollection = firestore.collection("restaurantes");


const DetalhesRestauranteTela = (props) => {

    const [modalVisivel, setModalVisivel] = useState(false);

    const [avaliacaoDigitada, setAvaliacaoDigitada] = useState('');

    const restaurante = props.navigation.state.params.restaurante;
    const avaliacoesCollection = restaurantesCollection.doc(restaurante.item.chave).collection('avaliacoes');

    const realizarAvaliacao = () => {
        return firestore.runTransaction((transaction) => {
            //obtem o restaurante para poder devolver uma promise
            //o doc é o próprio restaurante
            return transaction.get(restaurantesCollection.doc(restaurante.item.chave)).then((doc) => {
                //cria um novo documento para a nova avaliação
                let novaAvaliacao = avaliacoesCollection.doc();
                //calcula a nova media
                console.log("avaliacaoMedia: " + doc.data().avaliacaoMedia);
                console.log("qtdeAvaliacoes: " + doc.data().qtdeAvaliacoes);
                console.log("avaliacaoDigitada: " + avaliacaoDigitada);

                const novaMedia = (doc.data().avaliacaoMedia * doc.data().qtdeAvaliacoes + +avaliacaoDigitada) / (doc.data().qtdeAvaliacoes + 1);
                console.log("novaMedia: " + novaMedia);
                //atualiza o restaurante, mantendo as demais propriedades
                transaction.update(restaurantesCollection.doc(restaurante.item.chave), {
                    qtdeAvaliacoes: doc.data().qtdeAvaliacoes + 1,
                    avaliacaoMedia: novaMedia
                })
                setAvaliacaoDigitada('');
                return transaction.set(novaAvaliacao, {
                    data: new Date(),
                    avaliacao: avaliacaoDigitada
                })
            })

        })

    };

    return (
        <View style={estilos.container}>
            <Image
                source={{ uri: restaurante.item.fotoURL }}
                style={estilos.restauranteImage} />
            <Text
                style={estilos.nomeEAvaliacaoRestauranteText}>
                {restaurante.item.nome}  : {restaurante.item.avaliacaoMedia}
            </Text>
            <View
                style={estilos.avaliarButton}>
                <Button
                    title="Avaliar"
                    onPress={() => setModalVisivel(true)}
                />
            </View>
            <Modal
                visible={modalVisivel}
                onTouchOutside={() => setModalVisivel(false)}
            >
                <ModalContent>
                    <View>
                        <TextInput
                            style={estilos.avaliacaoTextInput}
                            placeholder="Digite uma nota de 1 a 5"
                            onChangeText={(t) => setAvaliacaoDigitada(t)}
                            value={avaliacaoDigitada}
                        />
                        <Button
                            title="OK"
                            onPress={() => {
                                realizarAvaliacao();
                                setModalVisivel(false);
                                props.navigation.goBack();
                            }}
                        />
                    </View>

                </ModalContent>
            </Modal>
        </View>
    );

};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50
    },
    restauranteImage: {
        width: '90%',
        height: 300,
        marginBottom: 8
    },
    nomeEAvaliacaoRestauranteText: {
        fontSize: 18,
        borderBottomColor: '#DDD',
        borderBottomWidth: 2,
        paddingBottom: 4,
        marginBottom: 4,
        width: '90%',
        textAlign: 'center'
    },
    avaliarButton: {
        width: '90%'
    },
    avaliacaoTextInput: {
        borderBottomColor: '#CCC',
        borderBottomWidth: 1,
        padding: 4,
        textAlign: 'center',
        marginBottom: 4
    }
});

export default DetalhesRestauranteTela;