import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import useFinanceStore from '../store/useFinanceStore';
import TransactionItem from '../components/TransactionItem';
import { colors } from '../theme';

export default function TransactionsScreen() {
  const { transactions, fetchDashboard } = useFinanceStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No transactions found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  empty: { color: colors.dim, marginTop: 20 }
});
