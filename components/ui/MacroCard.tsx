
import { View, Text, StyleSheet } from 'react-native'
import { MacroInfo } from '../../types'
import { Colors } from '../../constants/colors'

interface MacroCardProps {
  macroInfo: MacroInfo
  isDark?: boolean
}

export function MacroCard({ macroInfo, isDark = true }: MacroCardProps) {
  const theme = isDark ? Colors.dark : Colors.light

  const macroItems = [
    { label: 'Calories', value: macroInfo.calories, unit: 'kcal', color: Colors.calories },
    { label: 'Protein', value: macroInfo.protein, unit: 'g', color: Colors.protein },
    { label: 'Carbs', value: macroInfo.carbs, unit: 'g', color: Colors.carbs },
    { label: 'Fat', value: macroInfo.fat, unit: 'g', color: Colors.fat },
  ]

  const secondaryMacros = [
    { label: 'Fiber', value: macroInfo.fiber, unit: 'g' },
    { label: 'Sugar', value: macroInfo.sugar, unit: 'g' },
    { label: 'Sodium', value: macroInfo.sodium, unit: 'mg' },
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.foodName, { color: theme.text }]}>{macroInfo.foodName}</Text>
        <Text style={[styles.servingSize, { color: theme.textSecondary }]}>{macroInfo.servingSize}</Text>
      </View>

      <View style={styles.macroGrid}>
        {macroItems.map((item, index) => (
          <View key={index} style={styles.macroItem}>
            <View style={[styles.macroIndicator, { backgroundColor: item.color }]} />
            <Text style={[styles.macroValue, { color: theme.text }]}>
              {item.value}
              <Text style={[styles.macroUnit, { color: theme.textSecondary }]}> {item.unit}</Text>
            </Text>
            <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.secondaryMacros}>
        {secondaryMacros.map((item, index) => (
          <View key={index} style={styles.secondaryMacroItem}>
            <Text style={[styles.secondaryLabel, { color: theme.textSecondary }]}>{item.label}</Text>
            <Text style={[styles.secondaryValue, { color: theme.text }]}>
              {item.value}{item.unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    fontWeight: '500',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  macroUnit: {
    fontSize: 14,
    fontWeight: '500',
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  secondaryMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryMacroItem: {
    alignItems: 'center',
    flex: 1,
  },
  secondaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  secondaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
}) 