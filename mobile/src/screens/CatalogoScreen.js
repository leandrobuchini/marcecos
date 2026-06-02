import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import api from '../services/api'
import { useCarrito } from '../context/CarritoContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function CatalogoScreen() {
  const navigation = useNavigation()
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [cargando, setCargando] = useState(true)
  const [clienteLogueado, setClienteLogueado] = useState(null)
  const { agregarAlCarrito, cantidadItems } = useCarrito()

  const categorias = ['Todos', 'Juegos', 'Maderas', 'Bebes', 'Exterior', 'Educativos']

  useEffect(() => {
    AsyncStorage.getItem('cliente').then(data => {
      if (data) setClienteLogueado(JSON.parse(data))
    })
    api.get('/productos')
      .then(res => setProductos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err))
      .finally(() => setCargando(false))
  }, [])

  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva
    return coincideBusqueda && coincideCategoria
  })

  const renderProducto = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detalle', { producto: item })}
    >
      <View style={styles.cardImagen}>
        {item.imagen
          ? <Image source={{ uri: item.imagen }} style={styles.imagen} />
          : <Text style={styles.sinImagen}>Sin imagen</Text>
        }
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardNombre} numberOfLines={1}>{item.nombre}</Text>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardPrecio}>${Number(item.precio).toLocaleString()}</Text>
            <Text style={styles.cardCategoria}>{item.categoria}</Text>
          </View>
          <TouchableOpacity
            style={styles.btnAgregar}
            onPress={() => agregarAlCarrito(item)}
          >
            <Text style={styles.btnAgregarText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>

      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navTitulo}>Marcecos</Text>
        <View style={styles.navRight}>
          {clienteLogueado ? (
            <TouchableOpacity
              style={styles.btnPerfil}
              onPress={() => navigation.navigate('Perfil')}
            >
              <Text style={styles.btnPerfilText}>
                {clienteLogueado.nombre?.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnAdmin}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.btnAdminText}>Ingresar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.btnAdmin}
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <Text style={styles.btnAdminText}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCarrito}
            onPress={() => navigation.navigate('Carrito')}
          >
            <Text style={styles.btnCarritoText}>🛒</Text>
            {cantidadItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cantidadItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTag}>DESTACADOS</Text>
        <Text style={styles.heroTitle}>Nueva colección disponible</Text>
        <TouchableOpacity style={styles.heroBtn}>
          <Text style={styles.heroBtnText}>VER TODO</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.buscadorContainer}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar productos..."
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Categorías */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categorias}
        keyExtractor={item => item}
        style={styles.categoriasList}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoria, categoriaActiva === item && styles.categoriaActiva]}
            onPress={() => setCategoriaActiva(item)}
          >
            <Text style={[styles.categoriaText, categoriaActiva === item && styles.categoriaTextActiva]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Productos */}
      {cargando ? (
        <ActivityIndicator size="large" color="#0a0a0a" style={{ marginTop: 40 }} />
      ) : productosFiltrados.length === 0 ? (
        <Text style={styles.sinProductos}>No hay productos todavía</Text>
      ) : (
        <FlatList
          data={productosFiltrados}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.productosGrid}
          renderItem={renderProducto}
        />
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f6' },
  navbar: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ebebeb',
  },
  navTitulo: { fontSize: 16, fontWeight: '600', color: '#0a0a0a', letterSpacing: -0.3 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnAdmin: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 0.5, borderColor: '#ddd' },
  btnAdminText: { color: '#555', fontSize: 11, fontWeight: '500' },
  btnCarrito: { position: 'relative', padding: 4 },
  btnCarritoText: { fontSize: 20 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#0a0a0a', borderRadius: 10,
    width: 16, height: 16, alignItems: 'center', justifyContent: 'center'
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  hero: { backgroundColor: '#0a0a0a', padding: 20 },
  heroTag: { color: '#555', fontSize: 9, letterSpacing: 3, fontWeight: '500', marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '600', letterSpacing: -0.3, marginBottom: 12 },
  heroBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start' },
  heroBtnText: { color: '#0a0a0a', fontSize: 9, fontWeight: '700', letterSpacing: 2 },
  buscadorContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  buscador: {
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e0e0e0',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 13, color: '#0a0a0a',
  },
  categoriasList: { maxHeight: 40, marginBottom: 4 },
  categoria: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  categoriaActiva: { backgroundColor: '#0a0a0a', borderColor: '#0a0a0a' },
  categoriaText: { fontSize: 11, color: '#777', fontWeight: '500' },
  categoriaTextActiva: { color: '#fff' },
  productosGrid: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 24 },
  card: {
    flex: 1, backgroundColor: '#fff', margin: 6, borderRadius: 16,
    overflow: 'hidden', borderWidth: 0.5, borderColor: '#ebebeb',
  },
  cardImagen: {
    backgroundColor: '#f8f8f6', height: 130,
    alignItems: 'center', justifyContent: 'center',
  },
  imagen: { width: '100%', height: '100%' },
  sinImagen: { color: '#ccc', fontSize: 11 },
  cardBody: { padding: 10 },
  cardNombre: { fontSize: 12, fontWeight: '600', color: '#0a0a0a', marginBottom: 6 },
  cardFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  cardPrecio: { fontSize: 12, fontWeight: '700', color: '#0a0a0a' },
  cardCategoria: { fontSize: 9, color: '#aaa', marginTop: 2 },
  btnAgregar: {
    backgroundColor: '#0a0a0a', width: 26, height: 26,
    borderRadius: 13, alignItems: 'center', justifyContent: 'center'
  },
  btnAgregarText: { color: '#fff', fontSize: 18, lineHeight: 22 },
  sinProductos: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 14 },
  btnPerfil: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center'
  },
  btnPerfilText: { color: '#fff', fontSize: 13, fontWeight: '700' },
})