import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useFocusEffect } from '@react-navigation/core';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';


import { 
    Container,
    Header,
    User,
    UserInfo,
    Photo,
    UserGretting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions, 
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer,
    } from './styles';
import AsyncStorageLib from '@react-native-async-storage/async-storage/jest/async-storage-mock';

    export interface DataListProps extends TransactionCardProps{
        id: string;
    }
interface HighlightProps{
    amount: string;
    lastTransaction: string;
}    

interface HighlightData{
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;

}


export function Dashboard(){
   const [isLoading, setIsLoading] = useState(true); 
   const [transactions, setTransactions] = useState<DataListProps[]>([]);
   const [hightlightData, setHightlightData] = useState<HighlightData>({} as  HighlightData);

   const theme = useTheme();

  // AsyncStorage.removeItem('@gofinances:transactions')

   function getLastTransactionDate(
       collection: DataListProps[], 
       type: 'positive' | 'negative'
       ){

    const lastTransaction = new Date(
    Math.max.apply(Math, collection
    .filter(transaction => transaction.type === type)
    .map(transaction => new Date(transaction.date).getTime())))
   
     return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;

   }


   async function loadTransaction(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

        if(item.type === 'positive'){
            entriesTotal += Number(item.amount);
        }else {
            expensiveTotal += Number(item.amount);
        }
        
        const amount = Number(item.amount)
        .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        
        const date = Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }).format(new Date(item.date));

        return {
            id: item.id,
            name: item.name,
            amount,
            type: item.type,
            category: item.category,
            date,
        }
    });

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionExpensives}`;

   

    const total = entriesTotal - expensiveTotal;

    setHightlightData({
        entries: {
            amount: entriesTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }),
            lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
        },
        expensives: {
            amount: expensiveTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }),
            lastTransaction: `Última saida dia ${lastTransactionExpensives}`,
        },
        total: {
            amount: total.toLocaleString('pt-BR',{
                style: 'currency',
                currency: 'BRL',
                
            }),
            lastTransaction:totalInterval

        }
    });
    
    setIsLoading(false);
   
   } 

   useEffect(() => {
    loadTransaction();
   },[]);

   useFocusEffect(useCallback(() => {
       loadTransaction();
   }, []));

 return(
    <Container>
      { 
  
            isLoading ?  
            <LoadContainer>
               <ActivityIndicator 
                color={theme.colors.primary}
                size='large'
                /> 
            </LoadContainer>:
            <>
                <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo 
                                source={{uri:'https://avatars.githubusercontent.com/u/82467764?v=4' }}
                            />
                            <User>
                                <UserGretting>Olá,</UserGretting>
                                <UserName>Matheus</UserName>
                            </User>
                        </UserInfo>

                        <LogoutButton onPress={() => {}}>
                            <Icon name="power"/>
                        </LogoutButton>
                            
        
                </UserWrapper>
                
                </Header> 

                <HighlightCards>
                    
                    <HighlightCard 
                    type="up"
                    title="Entradas" 
                    amount={hightlightData.entries.amount} 
                    lastTransaction={hightlightData.entries.lastTransaction}
                    />
                    <HighlightCard 
                    type="down"
                    title="Saídas" 
                    amount={hightlightData.expensives.amount} 
                    lastTransaction={hightlightData.expensives.lastTransaction}
                    />

                    <HighlightCard 
                    type="total"
                    title="Total" 
                    amount={hightlightData.total.amount}
                    lastTransaction="01 á 16 de abril"
                    />

                </HighlightCards>

                <Transactions>
                    <Title>Listagem</Title>

                    <TransactionList
                        data={transactions}
                        keyExtractor={item => item.id}
                        renderItem = {({ item }) => <TransactionCard data={item} /> }
                        
                    
                    />
            
                    

                
                </Transactions>
            </>
        }

    </Container>
        
    )
}



