import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CarritoProvider } from './src/context/CarritoContext'

import InicioScreen from './src/screens/InicioScreen'
import CatalogoScreen from './src/screens/CatalogoScreen'
import CarritoScreen from './src/screens/CarritoScreen'
import DetalleScreen from './src/screens/DetalleScreen'
import ConfirmacionScreen from './src/screens/ConfirmacionScreen'
import AdminLoginScreen from './src/screens/AdminLoginScreen'
import AdminPanelScreen from './src/screens/AdminPanelScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <CarritoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicio" component={InicioScreen} />
          <Stack.Screen name="Catalogo" component={CatalogoScreen} />
          <Stack.Screen name="Detalle" component={DetalleScreen} />
          <Stack.Screen name="Carrito" component={CarritoScreen} />
          <Stack.Screen name="Confirmacion" component={ConfirmacionScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CarritoProvider>
  )
}