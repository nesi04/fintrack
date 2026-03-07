import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

export default function TransactionItem({ item }) {
  const income = item.type === 'income';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{income ? 'IN' : 'OUT'} | {item.title}</Text>
        <Text style={[styles.amount, { color: income ? colors.good : colors.bad }]}>
          {income ? '+' : '-'}${Number(item.amount).toFixed(2)}
        </Text>
      </View>
      <Text style={styles.meta}>{item.category} | {new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.panelBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 10
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontWeight: '700' },
  amount: { fontWeight: '700' },
  meta: { color: colors.dim, marginTop: 4 }
});
