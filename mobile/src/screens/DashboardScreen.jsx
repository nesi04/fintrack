import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import useFinanceStore from '../store/useFinanceStore';
import SummaryWidget from '../components/SummaryWidget';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme';

export default function DashboardScreen({ navigation }) {
  const { summary, error, fetchDashboard } = useFinanceStore();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>FINTRACK</Text>
          <Text style={styles.title}>{user?.name || 'Dashboard'}</Text>
        </View>
        <Pressable style={styles.ghostBtn} onPress={logout}><Text style={styles.ghostText}>Logout</Text></Pressable>
      </View>

      <SummaryWidget label="Income" value={`$${summary?.income || 0}`} />
      <SummaryWidget label="Expense" value={`$${summary?.expense || 0}`} />
      <SummaryWidget label="Balance" value={`$${summary?.balance || 0}`} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.row}>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.primaryText}>Transactions</Text>
        </Pressable>
        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('Budget')}>
          <Text style={styles.primaryText}>Budget</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  eyebrow: { color: colors.accent, letterSpacing: 2, fontSize: 12 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 4 },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  primaryBtn: { flex: 1, backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 12 },
  primaryText: { color: colors.accentDark, fontWeight: '700', textAlign: 'center' },
  ghostBtn: { borderColor: colors.panelBorder, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8 },
  ghostText: { color: colors.text },
  error: { color: colors.bad, marginVertical: 6 }
});
