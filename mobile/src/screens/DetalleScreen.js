import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext'

export default function DetalleScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { producto } = route.params
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const { agregarAlCarrito } = useCarrito()

  const handleAgregar = () => {
    agregarAlCarrito({ ...producto, cantidad })
    setAgregado(true)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVolver}>
          <Text style={styles.btnVolverText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>{producto.nombre}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Imagen */}
      <View style={styles.imagenContainer}>
        {producto.imagen
          ? <Image source={{ uri: producto.imagen }} style={styles.imagen} />
          : <Text style={styles.sinImagen}>Sin imagen</Text>
        }
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <Text style={styles.nombre}>{producto.nombre}</Text>
          <View style={styles.categoriaBadge}>
            <Text style={styles.categoriaText}>{producto.categoria}</Text>
          </View>
        </View>
        <Text style={styles.precio}>${Number(producto.precio).toLocaleString()}</Text>
        {producto.descripcion && (
          <Text style={styles.descripcion}>{producto.descripcion}</Text>
        )}
        <Text style={styles.stock}>Stock disponible: {producto.stock} unidades</Text>
      </View>

      {/* Separador */}
      <View style={styles.separador} />

      {/* Cantidad */}
      <View style={styles.cantidadContainer}>
        <Text style={styles.cantidadLabel}>CANTIDAD</Text>
        <View style={styles.cantidadControles}>
          <TouchableOpacity
            style={styles.btnCantidad}
            onPress={() => setCantidad(prev => Math.max(1, prev - 1))}
          >
            <Text style={styles.btnCantidadText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.cantidadNumero}>{cantidad}</Text>
          <TouchableOpacity
            style={styles.btnCantidad}
            onPress={() => setCantidad(prev => prev + 1)}
          >
            <Text style={styles.btnCantidadText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.botonesContainer}>
        {agregado && (
          <Text style={styles.agregadoText}>Agregado al carrito</Text>
        )}
        <TouchableOpacity style={styles.btnAgregar} onPress={handleAgregar}>
          <Text style={styles.btnAgregarText}>Agregar al carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnVerCarrito}
          onPress={() => navigation.navigate('Carrito')}
        >
          <Text style={styles.btnVerCarritoText}>Ver carrito</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f6' },
  header: {
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    paddingTop: 52, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: '#ebebeb',
  },
  btnVolver: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f8f8f6', alignItems: 'center', justifyContent: 'center'
  },
  btnVolverText: { fontSize: 20, color: '#555' },
  headerTitulo: { fontSize: 14, fontWeight: '600', color: '#0a0a0a', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  imagenContainer: {
    backgroundColor: '#fff', height: 280,
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 0.5, borderBottomColor: '#ebebeb',
  },
  imagen: { width: '100%', height: '100%' },
  sinImagen: { color: '#ccc', fontSize: 13 },
  infoContainer: { backgroundColor: '#fff', padding: 20, marginTop: 8 },
  infoHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  nombre: { fontSize: 18, fontWeight: '600', color: '#0a0a0a', letterSpacing: -0.3, flex: 1, marginRight: 10 },
  categoriaBadge: { backgroundColor: '#f3f3f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  categoriaText: { fontSize: 10, color: '#888', fontWeight: '500' },
  precio: { fontSize: 24, fontWeight: '700', color: '#0a0a0a', letterSpacing: -0.5, marginBottom: 10 },
  descripcion: { fontSize: 13, color: '#777', lineHeight: 20, marginBottom: 10 },
  stock: { fontSize: 11, color: '#aaa' },
  separador: { height: 0.5, backgroundColor: '#ebebeb', marginHorizontal: 16, marginVertical: 8 },
  cantidadContainer: { backgroundColor: '#fff', padding: 20, marginTop: 8 },
  cantidadLabel: { fontSize: 10, fontWeight: '600', color: '#0a0a0a', letterSpacing: 3, marginBottom: 14 },
  cantidadControles: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  btnCantidad: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 0.5,
    borderColor: '#ddd', alignItems: 'center', justifyContent: 'center'
  },
  btnCantidadText: { fontSize: 20, color: '#555' },
  cantidadNumero: { fontSize: 20, fontWeight: '600', color: '#0a0a0a', minWidth: 30, textAlign: 'center' },
  botonesContainer: { padding: 20, gap: 10, paddingBottom: 40 },
  agregadoText: { fontSize: 12, color: '#888', textAlign: 'center' },
  btnAgregar: {
    backgroundColor: '#0a0a0a', paddingVertical: 15,
    borderRadius: 30, alignItems: 'center'
  },
  btnAgregarText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  btnVerCarrito: {
    borderWidth: 0.5, borderColor: '#ddd', paddingVertical: 14,
    borderRadius: 30, alignItems: 'center'
  },
  btnVerCarritoText: { color: '#555', fontSize: 12, fontWeight: '500' },
})