import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import api from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    setCargando(true)
    try {
      const res = await api.post('/clientes/login', { email, password })
      await AsyncStorage.setItem('cliente_token', res.data.token)
      await AsyncStorage.setItem('cliente', JSON.stringify(res.data.cliente))
      navigation.navigate('Catalogo')
    } catch {
      Alert.alert('Error', 'Email o contraseña incorrectos')
    }
    setCargando(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.top}>
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Text style={styles.subtitulo}>Marcecos — Bienvenido de vuelta</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#bbb"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.btnLogin, cargando && styles.btnDeshabilitado]}
          onPress={handleLogin}
          disabled={cargando}
        >
          <Text style={styles.btnLoginText}>
            {cargando ? 'Ingresando...' : 'INICIAR SESIÓN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.linkText}>¿No tenés cuenta? <Text style={styles.link}>Registrate</Text></Text>
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
    backgroundColor: '#fff', borderRadius: 28, padding: 32,
    width: '100%', gap: 24,
  },
  top: { gap: 4 },
  titulo: { fontSize: 22, fontWeight: '600', color: '#0a0a0a', letterSpacing: -0.5 },
  subtitulo: { fontSize: 12, color: '#aaa' },
  form: { gap: 10 },
  input: {
    borderWidth: 0.5, borderColor: '#e0e0e0', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#0a0a0a',
  },
  btnLogin: {
    backgroundColor: '#0a0a0a', paddingVertical: 15,
    borderRadius: 30, alignItems: 'center'
  },
  btnDeshabilitado: { backgroundColor: '#555' },
  btnLoginText: { color: '#fff', fontWeight: '700', fontSize: 12, letterSpacing: 3 },
  linkText: { textAlign: 'center', fontSize: 13, color: '#aaa' },
  link: { color: '#0a0a0a', fontWeight: '600' },
})