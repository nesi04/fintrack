import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import useFinanceStore from '../store/useFinanceStore';
import BudgetCard from '../components/BudgetCard';
import { colors } from '../theme';

export default function BudgetScreen() {
  const { budgets, fetchDashboard } = useFinanceStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Budget Progress</Text>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <BudgetCard budget={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No budgets set yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  empty: { color: colors.dim, marginTop: 20 }
});
