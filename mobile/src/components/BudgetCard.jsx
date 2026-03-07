import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

export default function BudgetCard({ budget }) {
  const pct = Math.min((budget.spent / budget.limit) * 100, 100);
  const tone = pct < 70 ? colors.good : pct < 90 ? colors.warn : colors.bad;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{budget.category}</Text>
      <Text style={styles.meta}>${budget.spent} / ${budget.limit}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: tone }]} />
      </View>
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
  title: { color: colors.text, fontWeight: '700' },
  meta: { color: colors.dim, marginTop: 4 },
  track: { height: 8, borderRadius: 8, backgroundColor: '#2a3147', marginTop: 8 },
  fill: { height: 8, borderRadius: 8 }
});
