import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function InicioScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={styles.top}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <Text style={styles.nombre}>Marcecos</Text>
        <Text style={styles.subtitulo}>JUGUETERÍA</Text>
      </View>

      {/* Bienvenida */}
      <View style={styles.middle}>
        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.welcomeSub}>Welcome</Text>
      </View>

      {/* Botón */}
      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Catalogo')}
      >
        <Text style={styles.botonText}>INICIAR</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  top: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 44,
    fontWeight: '700',
    color: '#0a0a0a',
    letterSpacing: -2,
  },
  nombre: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  subtitulo: {
    color: '#444444',
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: '500',
  },
  middle: {
    alignItems: 'center',
    gap: 4,
  },
  welcome: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  welcomeSub: {
    color: '#444444',
    fontSize: 13,
  },
  boton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 56,
    paddingVertical: 14,
    borderRadius: 50,
  },
  botonText: {
    color: '#0a0a0a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
  },
})