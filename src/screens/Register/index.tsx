import React, { useState} from 'react';
import { 
    Keyboard, 
    Modal,
    Alert,

} from 'react-native';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { CommonActions, useNavigation } from '@react-navigation/native';


import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton  } from '../../components/Form/CategorySelectButton';



import { CategorySelect } from '../CategorySelect';

 import { 
     Container,
     Header,
     Title,
     Form,
     Fields,
     TransactionTypes,
     
} from './styles';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name:Yup
    .string()
    .required('Nome é Obrigatorio'),
    amount: Yup
    .number()
    .typeError(' Informe um valor númerico ')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')

}); // yup é uma biblioteca que serve para validação de formulario 

export function Register () {
    const [TransactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

   

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
        
    });
    
   const navigation = useNavigation();
    

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });
    
   /*const [ name, setName] = useState('');
    const [ amount, setAmount ] = useState(''); */

    function handleNavigationToListagem(){
        navigation.dispatch(
            CommonActions.navigate({
                name: 'Listagem',
            })
        );
    }
   

    function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }
        
    

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

 async function handleRegister(form: FormData){
        if(!TransactionType)
        return Alert.alert('Selecione o tipo da transação');//Se na tela do formulario o usuario não colocar nada enviara uma mensagem

        if(category.key === 'category')
        return Alert.alert('Selecione a categoria'); //Se na tela do formulario o usuario não colocar nada enviara uma mensagem

        const newTransaction = {
           id: String(uuid.v4()), 
           name: form.name,
           amount: form.amount,
           type: TransactionType,
           category: category.key,
           date: new Date()

        }
        
        try {
            const dataKey = '@gofinances:transactions';
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
        ];

        await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

        reset();
        setTransactionType('');
        setCategory({
            key: 'category',
            name: 'Categoria'
        });

        //navigation.navigate("Listagem");

        handleNavigationToListagem();

        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível salvar");
    
        }
     

    }

    /*useEffect(() => {
        async function loadData(){
            const data = await AsyncStorage.getItem(dataKey);
            console.log(JSON.parse(data));
        }

        loadData();
       
    },[])*/

    


    return(

        <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss}
            containerStyle={{ flex: 1}}
            style={{ flex: 1}}
            > 
            
            <Container>
            
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                
                
            <Form>
                <Fields>
                    <InputForm
                        name="name"
                        control={control}
                        placeholder="Nome" 
                        placeholderTextColor="grey"
                        autoCapitalize="sentences" // define como quero colocar em maiusculo cada palavra/sentenca
                        autoCorrect={false} //serve para corrigir palavras
                        error={errors.name && errors.name.message}

                        //onChangeText={setName} // ou text => setname(text)

                    />
                    <InputForm
                        name="amount"
                        control={control}
                        placeholder="Preço" 
                        placeholderTextColor="grey"
                        keyboardType="numeric" //muda o teclado ou para texto ou para númerico dependendo da necessidade
                        error={errors.amount && errors.amount.message}
                        //onChangeText={setAmount}

                    />
                    <TransactionTypes>
                        <TransactionTypeButton
                            type="up"
                            title="Income"
                            onPress={() => handleTransactionsTypeSelect('positive')}
                            isActive={TransactionType === 'positive'}
                        />
                        <TransactionTypeButton
                            type="down"
                            title="Outcome"
                            onPress={() => handleTransactionsTypeSelect('negative')}
                            isActive={TransactionType === 'negative'}
                        />
                    </TransactionTypes> 

                    <CategorySelectButton
                        title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                    />   

            
                </Fields>
                <Button 
                    title="Enviar"
                    onPress={handleSubmit(handleRegister)}
                />
                
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}

                />

                
            </Modal>

            
                
            

            </Container>
        </TouchableWithoutFeedback> //Ao tocar em qualquer ambiente na tela o teclado fecha

    );
}