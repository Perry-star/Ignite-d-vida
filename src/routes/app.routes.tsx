import React from "react";
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from 'styled-components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { Navigator, Screen} = createBottomTabNavigator();

import { Dashboard } from '../screens/Dashboard';
//import { CategorySelect } from '../screens/CategorySelect';
import { Register } from '../screens/Register';


export function AppRoutes(){
    const theme = useTheme();
    return(
        <Navigator
            screenOptions={{
                headerShown: false, // remove o cabeçalho
                tabBarActiveTintColor: theme.colors.secondary,  //define cor para quando o menu que foi solicitado estiver ativo
                tabBarInactiveTintColor: theme.colors.text, //define a cor para quando o menu que foi solicitado não estiver ativo
                tabBarLabelPosition: 'beside-icon',  // colocar o icone do lado do texto
                tabBarStyle: {
                    height: 88,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                }
            }}
        >
            <Screen 
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color }) => 
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Screen
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color}) =>
                        <MaterialIcons
                            name="attach-money"
                            size={size}
                            color={color}
                        />
                    )
                }}
                
            />
            <Screen
                name="Resumo"
                component={Register}
                options={{
                    tabBarIcon:(({ size, color}) => 
                        <MaterialIcons
                            name="pie-chart"
                            size={size}
                            color={color}
                        />                    )
                }}
            />
        </Navigator>
    )
}