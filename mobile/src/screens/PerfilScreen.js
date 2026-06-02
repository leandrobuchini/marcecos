import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

export default function PerfilScreen() {
  const navigation = useNavigation()
  const [cliente, setCliente] = useState(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const cargarPerfil = async () => {
        const token = await AsyncStorage.getItem('cliente_token')
        if (!token) {
          navigation.navigate('Login')
          return
        }
        try {
          const res = await api.get('/clientes/perfil')
          setCliente(res.data)
          setNombre(res.data.nombre || '')
          setTelefono(res.data.telefono || '')
          setDireccion(res.data.direccion || '')
          setCiudad(res.data.ciudad || '')

          const resPedidos = await api.get('/clientes/pedidos')
          setPedidos(Array.isArray(resPedidos.data) ? resPedidos.data : [])
        } catch {
          navigation.navigate('Login')
        }
      }
      cargarPerfil()
    }, [])
  )

  const handleGuardar = async () => {
    setCargando(true)
    try {
      await api.put('/clientes/perfil', { nombre, telefono, direccion, ciudad })
      Alert.alert('Listo', 'Perfil actualizado correctamente')
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el perfil')
    }
    setCargando(false)
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('cliente_token')
    await AsyncStorage.removeItem('cliente')
    navigation.navigate('Catalogo')
  }

  if (!cliente) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Mi perfil</Text>
          <Text style={styles.headerEmail}>{cliente.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.btnSalir}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {cliente.nombre?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.avatarNombre}>{cliente.nombre}</Text>
        <Text style={styles.avatarFecha}>
          Cliente desde {new Date(cliente.creado_en).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
        <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor="#bbb" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#bbb" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DIRECCIÓN DE ENVÍO</Text>
        <TextInput style={styles.input} placeholder="Dirección" placeholderTextColor="#bbb" value={direccion} onChangeText={setDireccion} />
        <TextInput style={styles.input} placeholder="Ciudad" placeholderTextColor="#bbb" value={ciudad} onChangeText={setCiudad} />
      </View>

      <View style={styles.botonesSection}>
        <TouchableOpacity
          style={[styles.btnGuardar, cargando && styles.btnDeshabilitado]}
          onPress={handleGuardar}
          disabled={cargando}
        >
          <Text style={styles.btnGuardarText}>{cargando ? 'Guardando...' : 'GUARDAR CAMBIOS'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.navigate('Catalogo')}>
          <Text style={styles.btnVolverText}>Volver al catálogo</Text>
        </TouchableOpacity>
      </View>

      {/* Historial de pedidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MIS PEDIDOS</Text>
        {pedidos.length === 0 ? (
          <View style={styles.sinPedidos}>
            <Text style={styles.sinPedidosText}>Todavía no realizaste ningún pedido</Text>
          </View>
        ) : (
          pedidos.map(pedido => (
            <View key={pedido.id} style={styles.pedidoCard}>
              <View style={styles.pedidoHeader}>
                <View>
                  <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                  <Text style={styles.pedidoFecha}>
                    {new Date(pedido.creado_en).toLocaleDateString('es-AR')}
                  </Text>
                </View>
                <View style={[styles.estadoBadge,
                  pedido.estado === 'pendiente' && styles.estadoPendiente,
                  pedido.estado === 'enviado' && styles.estadoEnviado,
                  pedido.estado === 'entregado' && styles.estadoEntregado,
                ]}>
                  <Text style={styles.estadoText}>{pedido.estado}</Text>
                </View>
              </View>
              {pedido.items.map((item, index) => (
                <View key={index} style={styles.pedidoItem}>
                  <Text style={styles.pedidoItemNombre}>{item.nombre} x{item.cantidad}</Text>
                  <Text style={styles.pedidoItemPrecio}>${Number(item.precio * item.cantidad).toLocaleString()}</Text>
                </View>
              ))}
              <View style={styles.pedidoTotal}>
                <Text style={styles.pedidoTotalLabel}>Total</Text>
                <Text style={styles.pedidoTotalValor}>${Number(pedido.total).toLocaleString()}</Text>
              </View>
            </View>
          ))
        )}
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f6' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f6' },
  loadingText: { color: '#aaa', fontSize: 14 },
  header: {
    backgroundColor: '#0a0a0a', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingTop: 52, paddingBottom: 16,
  },
  headerTitulo: { color: '#fff', fontSize: 16, fontWeight: '600', letterSpacing: -0.3 },
  headerEmail: { color: '#555', fontSize: 11, marginTop: 2 },
  btnSalir: { color: '#555', fontSize: 13 },
  avatarSection: {
    backgroundColor: '#0a0a0a', alignItems: 'center',
    paddingBottom: 28, paddingTop: 4,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 10
  },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#0a0a0a' },
  avatarNombre: { color: '#fff', fontSize: 16, fontWeight: '500' },
  avatarFecha: { color: '#555', fontSize: 11, marginTop: 4 },
  section: { padding: 16, gap: 8 },
  sectionTitle: { fontSize: 10, fontWeight: '600', color: '#0a0a0a', letterSpacing: 3, marginBottom: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e0e0e0',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#0a0a0a',
  },
  botonesSection: { paddingHorizontal: 16, gap: 10 },
  btnGuardar: {
    backgroundColor: '#0a0a0a', paddingVertical: 15,
    borderRadius: 30, alignItems: 'center'
  },
  btnDeshabilitado: { backgroundColor: '#555' },
  btnGuardarText: { color: '#fff', fontWeight: '700', fontSize: 11, letterSpacing: 2 },
  btnVolver: {
    borderWidth: 0.5, borderColor: '#ddd', paddingVertical: 13,
    borderRadius: 30, alignItems: 'center'
  },
  btnVolverText: { color: '#888', fontSize: 12 },
  sinPedidos: {
    backgroundColor: '#fff', borderRadius: 16, padding: 24,
    alignItems: 'center', borderWidth: 0.5, borderColor: '#ebebeb'
  },
  sinPedidosText: { color: '#aaa', fontSize: 13 },
  pedidoCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    borderWidth: 0.5, borderColor: '#ebebeb', marginBottom: 8
  },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  pedidoId: { fontSize: 13, fontWeight: '600', color: '#0a0a0a' },
  pedidoFecha: { fontSize: 10, color: '#aaa', marginTop: 2 },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  estadoPendiente: { backgroundColor: '#fef9e7' },
  estadoEnviado: { backgroundColor: '#eef4ff' },
  estadoEntregado: { backgroundColor: '#eefaf3' },
  estadoText: { fontSize: 10, fontWeight: '600', color: '#555' },
  pedidoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  pedidoItemNombre: { fontSize: 12, color: '#777' },
  pedidoItemPrecio: { fontSize: 12, fontWeight: '600', color: '#0a0a0a' },
  pedidoTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 0.5, borderTopColor: '#ebebeb',
    paddingTop: 8, marginTop: 6
  },
  pedidoTotalLabel: { fontSize: 12, color: '#888' },
  pedidoTotalValor: { fontSize: 14, fontWeight: '700', color: '#0a0a0a' },
})