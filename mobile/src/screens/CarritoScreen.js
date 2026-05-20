import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useCarrito } from '../context/CarritoContext'

export default function CarritoScreen() {
  const navigation = useNavigation()
  const { carrito, cambiarCantidad, eliminarDelCarrito, total, cantidadItems } = useCarrito()

  const handleWhatsApp = () => {
    const mensaje = '🛒 Hola! Quiero hacer un pedido en Marcecos:\n\n' +
      carrito.map(item => `• ${item.nombre} x${item.cantidad} - $${Number(item.precio * item.cantidad).toLocaleString()}`).join('\n') +
      `\n\nTotal: $${total.toLocaleString()}`
    Linking.openURL(`https://wa.me/543425298828?text=${encodeURIComponent(mensaje)}`)
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardImagen}>
        {item.imagen
          ? <Image source={{ uri: item.imagen }} style={styles.imagen} />
          : <Text style={styles.sinImagen}>Sin foto</Text>
        }
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNombre} numberOfLines={1}>{item.nombre}</Text>
        <Text style={styles.cardPrecio}>${Number(item.precio).toLocaleString()}</Text>
        <View style={styles.cantidadControles}>
          <TouchableOpacity
            style={styles.btnCantidad}
            onPress={() => cambiarCantidad(item.id, -1)}
          >
            <Text style={styles.btnCantidadText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.cantidad}>{item.cantidad}</Text>
          <TouchableOpacity
            style={styles.btnCantidad}
            onPress={() => cambiarCantidad(item.id, 1)}
          >
            <Text style={styles.btnCantidadText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => eliminarDelCarrito(item.id)}
        style={styles.btnEliminar}
      >
        <Text style={styles.btnEliminarText}>✕</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Tu carrito</Text>
          <Text style={styles.headerSubtitulo}>{cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'}</Text>
        </View>
        <TouchableOpacity
          style={styles.btnCerrar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnCerrarText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {carrito.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.vacioText}>Tu carrito está vacío</Text>
          <TouchableOpacity
            style={styles.btnVerProductos}
            onPress={() => navigation.navigate('Catalogo')}
          >
            <Text style={styles.btnVerProductosText}>Ver productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={carrito}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.lista}
            renderItem={renderItem}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValor}>${total.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.btnPagar} onPress={handleWhatsApp}>
              <Text style={styles.btnPagarText}>Consultar por WhatsApp</Text>
            </TouchableOpacity>
            <Text style={styles.seguro}>Envíos a todo el país · Pagos seguros</Text>
          </View>
        </>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f6' },
  header: {
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingTop: 52, paddingBottom: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#ebebeb',
  },
  headerTitulo: { fontSize: 18, fontWeight: '600', color: '#0a0a0a', letterSpacing: -0.3 },
  headerSubtitulo: { fontSize: 12, color: '#aaa', marginTop: 2 },
  btnCerrar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f3f3f0', alignItems: 'center', justifyContent: 'center'
  },
  btnCerrarText: { fontSize: 14, color: '#888' },
  lista: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 0.5, borderColor: '#ebebeb',
  },
  cardImagen: {
    width: 72, height: 72, backgroundColor: '#f8f8f6',
    borderRadius: 12, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center'
  },
  imagen: { width: 72, height: 72 },
  sinImagen: { color: '#ccc', fontSize: 10 },
  cardInfo: { flex: 1 },
  cardNombre: { fontSize: 13, fontWeight: '600', color: '#0a0a0a', marginBottom: 2 },
  cardPrecio: { fontSize: 13, fontWeight: '700', color: '#0a0a0a', marginBottom: 8 },
  cantidadControles: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnCantidad: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 0.5,
    borderColor: '#ddd', alignItems: 'center', justifyContent: 'center'
  },
  btnCantidadText: { fontSize: 16, color: '#555' },
  cantidad: { fontSize: 14, fontWeight: '600', color: '#0a0a0a', minWidth: 20, textAlign: 'center' },
  btnEliminar: { padding: 6 },
  btnEliminarText: { fontSize: 14, color: '#ccc' },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  vacioText: { fontSize: 15, color: '#aaa' },
  btnVerProductos: {
    backgroundColor: '#0a0a0a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30
  },
  btnVerProductosText: { color: '#fff', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  footer: {
    backgroundColor: '#fff', padding: 20,
    borderTopWidth: 0.5, borderTopColor: '#ebebeb',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel: { fontSize: 13, color: '#888', fontWeight: '500' },
  totalValor: { fontSize: 22, fontWeight: '700', color: '#0a0a0a', letterSpacing: -0.5 },
  btnPagar: {
    backgroundColor: '#0a0a0a', paddingVertical: 15,
    borderRadius: 30, alignItems: 'center', marginBottom: 10
  },
  btnPagarText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  seguro: { textAlign: 'center', color: '#bbb', fontSize: 10, letterSpacing: 0.5 },
})