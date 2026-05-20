import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useCarrito } from '../context/CarritoContext'

export default function ConfirmacionScreen() {
  const navigation = useNavigation()
  const { vaciarCarrito } = useCarrito()

  const handleSeguir = () => {
    vaciarCarrito()
    navigation.navigate('Catalogo')
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.icono}>
          <Text style={styles.iconoText}>✓</Text>
        </View>

        <Text style={styles.titulo}>Pedido confirmado</Text>
        <Text style={styles.mensaje}>
          Gracias por tu compra en Marcecos. Nos contactamos a la brevedad para coordinar el envío.
        </Text>

        <View style={styles.separador} />

        <Text style={styles.seguro}>Envíos a todo el país · Pagos seguros</Text>

        <TouchableOpacity style={styles.btnSeguir} onPress={handleSeguir}>
          <Text style={styles.btnSeguirText}>Seguir comprando</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a0a0a',
    alignItems: 'center', justifyContent: 'center', padding: 24
  },
  card: {
    backgroundColor: '#fff', borderRadius: 28, padding: 36,
    width: '100%', alignItems: 'center',
  },
  icono: {
    width: 64, height: 64, backgroundColor: '#f3f3f0',
    borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20
  },
  iconoText: { fontSize: 24, color: '#0a0a0a', fontWeight: '300' },
  titulo: { fontSize: 20, fontWeight: '600', color: '#0a0a0a', letterSpacing: -0.3, marginBottom: 10 },
  mensaje: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  separador: { width: '100%', height: 0.5, backgroundColor: '#ebebeb', marginBottom: 16 },
  seguro: { fontSize: 10, color: '#bbb', letterSpacing: 0.5, marginBottom: 24 },
  btnSeguir: {
    backgroundColor: '#0a0a0a', paddingVertical: 14,
    paddingHorizontal: 40, borderRadius: 30
  },
  btnSeguirText: { color: '#fff', fontWeight: '700', fontSize: 12, letterSpacing: 2 },
})