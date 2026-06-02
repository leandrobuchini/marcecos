import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import api from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RegistroScreen() {
  const navigation = useNavigation()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Completá todos los campos')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres')
      return
    }
    setCargando(true)
    try {
      const res = await api.post('/clientes/registrar', { nombre, email, password })
      await AsyncStorage.setItem('cliente_token', res.data.token)
      await AsyncStorage.setItem('cliente', JSON.stringify(res.data.cliente))
      navigation.navigate('Catalogo')
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Error al crear la cuenta')
    }
    setCargando(false)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>

        <View style={styles.top}>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Marcecos — Registrate gratis</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#bbb"
            value={nombre}
            onChangeText={setNombre}
          />
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
            placeholder="Contraseña (mínimo 6 caracteres)"
            placeholderTextColor="#bbb"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.btnRegistro, cargando && styles.btnDeshabilitado]}
          onPress={handleRegistro}
          disabled={cargando}
        >
          <Text style={styles.btnRegistroText}>
            {cargando ? 'Creando cuenta...' : 'CREAR CUENTA'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>¿Ya tenés cuenta? <Text style={styles.link}>Iniciá sesión</Text></Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
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
  btnRegistro: {
    backgroundColor: '#0a0a0a', paddingVertical: 15,
    borderRadius: 30, alignItems: 'center'
  },
  btnDeshabilitado: { backgroundColor: '#555' },
  btnRegistroText: { color: '#fff', fontWeight: '700', fontSize: 12, letterSpacing: 3 },
  linkText: { textAlign: 'center', fontSize: 13, color: '#aaa' },
  link: { color: '#0a0a0a', fontWeight: '600' },
})