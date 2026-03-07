import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', currency: 'USD' });
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    try {
      await register({ ...form, email: form.email.trim() });
    } catch (e) {
      setError(e.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>FINTRACK</Text>
        <Text style={styles.title}>Create Account</Text>
        <TextInput placeholder="Name" placeholderTextColor={colors.dim} value={form.name} onChangeText={(value) => setForm({ ...form, name: value })} style={styles.input} />
        <TextInput placeholder="Email" placeholderTextColor={colors.dim} value={form.email} onChangeText={(value) => setForm({ ...form, email: value })} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Password" placeholderTextColor={colors.dim} secureTextEntry value={form.password} onChangeText={(value) => setForm({ ...form, password: value })} style={styles.input} />
        <TextInput placeholder="Currency" placeholderTextColor={colors.dim} value={form.currency} onChangeText={(value) => setForm({ ...form, currency: value.toUpperCase() })} style={styles.input} maxLength={3} autoCapitalize="characters" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.primaryBtn} onPress={submit}><Text style={styles.primaryText}>Register</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Login')}><Text style={styles.link}>Back to login</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 18 },
  card: { backgroundColor: colors.panel, borderColor: colors.panelBorder, borderWidth: 1, borderRadius: radius.lg, padding: 16, gap: 10 },
  eyebrow: { color: colors.accent, letterSpacing: 2, fontSize: 12 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 4 },
  input: { backgroundColor: '#0e1220', color: colors.text, borderColor: colors.panelBorder, borderWidth: 1, borderRadius: radius.md, padding: 12 },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 12, marginTop: 6 },
  primaryText: { color: colors.accentDark, fontWeight: '700', textAlign: 'center' },
  link: { color: colors.dim, textAlign: 'center', marginTop: 6 },
  error: { color: colors.bad }
});
