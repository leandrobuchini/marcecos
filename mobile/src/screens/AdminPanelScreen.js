import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

export default function AdminPanelScreen() {
  const navigation = useNavigation()
  const [vista, setVista] = useState('agregar')
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('Juegos')
  const [stock, setStock] = useState('')
  const [imagen, setImagen] = useState('')
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')

  const categorias = ['Juegos', 'Maderas', 'Bebes', 'Exterior', 'Educativos']

  const cargarProductos = () => {
    api.get('/productos')
      .then(res => setProductos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
  }

  const cargarPedidos = () => {
    api.get('/pedidos')
      .then(res => setPedidos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    cargarProductos()
    cargarPedidos()
  }, [])

  const limpiarFormulario = () => {
    setNombre(''); setPrecio(''); setCategoria('Juegos')
    setStock(''); setImagen(''); setEditando(null); setMensaje('')
  }

  const handleFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería')
      return
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    })
    if (!resultado.canceled) {
      setSubiendoFoto(true)
      try {
        const formData = new FormData()
        formData.append('imagen', {
          uri: resultado.assets[0].uri,
          type: 'image/jpeg', name: 'producto.jpg'
        })
        const res = await api.post('/productos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setImagen(res.data.url)
        setMensaje('Foto subida!')
      } catch {
        Alert.alert('Error', 'No se pudo subir la foto')
      }
      setSubiendoFoto(false)
    }
  }

  const handleGuardar = async () => {
    if (!nombre || !precio) {
      Alert.alert('Error', 'Nombre y precio son obligatorios')
      return
    }
    try {
      if (editando) {
        await api.put(`/productos/${editando}`, {
          nombre, precio: Number(precio),
          categoria, stock: Number(stock) || 0, imagen
        })
        setMensaje('Producto actualizado!')
      } else {
        await api.post('/productos', {
          nombre, precio: Number(precio),
          categoria, stock: Number(stock) || 0, imagen
        })
        setMensaje('Producto agregado!')
      }
      limpiarFormulario()
      cargarProductos()
    } catch {
      Alert.alert('Error', 'No se pudo guardar el producto')
    }
  }

  const handleEditar = (producto) => {
    setEditando(producto.id)
    setNombre(producto.nombre)
    setPrecio(String(producto.precio))
    setCategoria(producto.categoria)
    setStock(String(producto.stock))
    setImagen(producto.imagen || '')
    setVista('agregar')
  }

  const handleEliminar = (id) => {
    Alert.alert('Eliminar', '¿Seguro que querés eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await api.delete(`/productos/${id}`)
        cargarProductos()
      }}
    ])
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    navigation.navigate('Catalogo')
  }

  const tabs = [
    { id: 'agregar', label: editando ? 'Editando' : 'Agregar' },
    { id: 'lista', label: `Productos (${productos.length})` },
    { id: 'pedidos', label: `Pedidos (${pedidos.length})` },
  ]

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Panel Marcecos</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.btnSalir}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, vista === tab.id && styles.tabActivo]}
            onPress={() => { setVista(tab.id); limpiarFormulario() }}
          >
            <Text style={[styles.tabText, vista === tab.id && styles.tabTextActivo]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.contenido} showsVerticalScrollIndicator={false}>

        {/* Vista Agregar/Editar */}
        {vista === 'agregar' && (
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Nombre del producto" placeholderTextColor="#bbb" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="$ Precio" placeholderTextColor="#bbb" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Stock" placeholderTextColor="#bbb" value={stock} onChangeText={setStock} keyboardType="numeric" />

            {/* Categorías */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {categorias.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catBtn, categoria === cat && styles.catBtnActivo]}
                    onPress={() => setCategoria(cat)}
                  >
                    <Text style={[styles.catBtnText, categoria === cat && styles.catBtnTextActivo]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Foto */}
            <TouchableOpacity style={styles.fotoContainer} onPress={handleFoto}>
              {imagen ? (
                <Image source={{ uri: imagen }} style={styles.fotoPreview} />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Text style={styles.fotoIcono}>📷</Text>
                  <Text style={styles.fotoText}>{subiendoFoto ? 'Subiendo...' : 'Tocar para subir foto'}</Text>
                  <Text style={styles.fotoSub}>JPG, PNG o WEBP</Text>
                </View>
              )}
            </TouchableOpacity>

            {imagen && (
              <TouchableOpacity onPress={() => setImagen('')}>
                <Text style={styles.cambiarFoto}>Cambiar foto</Text>
              </TouchableOpacity>
            )}

            {mensaje ? <Text style={styles.mensajeExito}>{mensaje}</Text> : null}

            <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
              <Text style={styles.btnGuardarText}>
                {editando ? 'GUARDAR CAMBIOS' : '+ AGREGAR AL CATÁLOGO'}
              </Text>
            </TouchableOpacity>

            {editando && (
              <TouchableOpacity style={styles.btnCancelar} onPress={limpiarFormulario}>
                <Text style={styles.btnCancelarText}>Cancelar edición</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Vista Lista */}
        {vista === 'lista' && (
          <View style={styles.lista}>
            {productos.map(producto => (
              <View key={producto.id} style={styles.productoCard}>
                <View style={styles.productoImagen}>
                  {producto.imagen
                    ? <Image source={{ uri: producto.imagen }} style={styles.productoImg} />
                    : <Text style={styles.sinFoto}>Sin foto</Text>
                  }
                </View>
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre} numberOfLines={1}>{producto.nombre}</Text>
                  <Text style={styles.productoPrecio}>${Number(producto.precio).toLocaleString()}</Text>
                  <Text style={styles.productoStock}>Stock: {producto.stock} · {producto.categoria}</Text>
                </View>
                <View style={styles.productoBotones}>
                  <TouchableOpacity style={styles.btnEditar} onPress={() => handleEditar(producto)}>
                    <Text style={styles.btnEditarText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnEliminarBtn} onPress={() => handleEliminar(producto.id)}>
                    <Text style={styles.btnEliminarText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Vista Pedidos */}
        {vista === 'pedidos' && (
          <View style={styles.lista}>
            {pedidos.length === 0 ? (
              <Text style={styles.sinPedidos}>No hay pedidos todavía</Text>
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

                  <View style={styles.estadoBotones}>
                    {['pendiente', 'enviado', 'entregado'].map(estado => (
                      <TouchableOpacity
                        key={estado}
                        style={[styles.estadoBtn, pedido.estado === estado && styles.estadoBtnActivo]}
                        onPress={async () => {
                          await api.put(`/pedidos/${pedido.id}`, { estado })
                          cargarPedidos()
                        }}
                      >
                        <Text style={[styles.estadoBtnText, pedido.estado === estado && styles.estadoBtnTextActivo]}>
                          {estado}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f6' },
  header: {
    backgroundColor: '#0a0a0a', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingTop: 52, paddingBottom: 16,
  },
  headerTitulo: { color: '#fff', fontSize: 16, fontWeight: '600', letterSpacing: -0.3 },
  btnSalir: { color: '#555', fontSize: 13 },
  tabs: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 0.5, borderBottomColor: '#ebebeb'
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActivo: { borderBottomWidth: 1.5, borderBottomColor: '#0a0a0a' },
  tabText: { fontSize: 10, color: '#aaa', fontWeight: '600', letterSpacing: 1 },
  tabTextActivo: { color: '#0a0a0a' },
  contenido: { flex: 1 },
  form: { padding: 16, gap: 10 },
  input: {
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e0e0e0',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#0a0a0a',
  },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  catBtnActivo: { backgroundColor: '#0a0a0a', borderColor: '#0a0a0a' },
  catBtnText: { fontSize: 11, color: '#777', fontWeight: '500' },
  catBtnTextActivo: { color: '#fff' },
  fotoContainer: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#e0e0e0',
    borderRadius: 16, overflow: 'hidden', height: 160,
    alignItems: 'center', justifyContent: 'center'
  },
  fotoPlaceholder: { alignItems: 'center', gap: 6 },
  fotoIcono: { fontSize: 32 },
  fotoText: { color: '#aaa', fontSize: 13 },
  fotoSub: { color: '#ccc', fontSize: 11 },
  fotoPreview: { width: '100%', height: '100%' },
  cambiarFoto: { color: '#aaa', textAlign: 'center', fontSize: 12 },
  mensajeExito: { color: '#888', textAlign: 'center', fontSize: 12 },
  btnGuardar: {
    backgroundColor: '#0a0a0a', paddingVertical: 15,
    borderRadius: 30, alignItems: 'center'
  },
  btnGuardarText: { color: '#fff', fontWeight: '700', fontSize: 11, letterSpacing: 2 },
  btnCancelar: {
    borderWidth: 0.5, borderColor: '#ddd', paddingVertical: 13,
    borderRadius: 30, alignItems: 'center'
  },
  btnCancelarText: { color: '#888', fontSize: 12 },
  lista: { padding: 16, gap: 10 },
  productoCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 0.5, borderColor: '#ebebeb',
  },
  productoImagen: {
    width: 56, height: 56, backgroundColor: '#f8f8f6',
    borderRadius: 10, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center'
  },
  productoImg: { width: 56, height: 56 },
  sinFoto: { color: '#ccc', fontSize: 9 },
  productoInfo: { flex: 1 },
  productoNombre: { fontSize: 13, fontWeight: '600', color: '#0a0a0a' },
  productoPrecio: { fontSize: 12, fontWeight: '700', color: '#0a0a0a', marginTop: 1 },
  productoStock: { fontSize: 10, color: '#aaa', marginTop: 1 },
  productoBotones: { gap: 6 },
  btnEditar: { backgroundColor: '#f3f3f0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  btnEditarText: { color: '#555', fontSize: 10, fontWeight: '600' },
  btnEliminarBtn: { backgroundColor: '#fff0f0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  btnEliminarText: { color: '#e88', fontSize: 10, fontWeight: '600' },
  sinPedidos: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 14 },
  pedidoCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 0.5, borderColor: '#ebebeb',
  },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  pedidoId: { fontSize: 14, fontWeight: '600', color: '#0a0a0a' },
  pedidoFecha: { fontSize: 11, color: '#aaa', marginTop: 2 },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  estadoPendiente: { backgroundColor: '#fef9e7' },
  estadoEnviado: { backgroundColor: '#eef4ff' },
  estadoEntregado: { backgroundColor: '#eefaf3' },
  estadoText: { fontSize: 11, fontWeight: '600', color: '#555' },
  pedidoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  pedidoItemNombre: { fontSize: 12, color: '#777' },
  pedidoItemPrecio: { fontSize: 12, fontWeight: '600', color: '#0a0a0a' },
  pedidoTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 0.5, borderTopColor: '#ebebeb',
    paddingTop: 10, marginTop: 6, marginBottom: 12
  },
  pedidoTotalLabel: { fontWeight: '600', color: '#555', fontSize: 13 },
  pedidoTotalValor: { fontWeight: '700', color: '#0a0a0a', fontSize: 15 },
  estadoBotones: { flexDirection: 'row', gap: 6 },
  estadoBtn: {
    flex: 1, paddingVertical: 7, borderRadius: 20,
    borderWidth: 0.5, borderColor: '#e0e0e0', alignItems: 'center'
  },
  estadoBtnActivo: { backgroundColor: '#0a0a0a', borderColor: '#0a0a0a' },
  estadoBtnText: { fontSize: 10, color: '#aaa', fontWeight: '600' },
  estadoBtnTextActivo: { color: '#fff' },
})