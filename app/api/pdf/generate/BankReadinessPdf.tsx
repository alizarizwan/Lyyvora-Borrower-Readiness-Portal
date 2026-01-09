import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { CHECKLIST_LABELS } from "@/lib/assessment/failureMap"

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 10 },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, marginBottom: 6 },
  item: { marginBottom: 4 },
})

export function BankReadinessPdf({ scoreResult }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Bank Readiness Brief</Text>

        <View style={styles.section}>
          <Text>Score: {scoreResult.score} / 100</Text>
          <Text>Category: {scoreResult.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Assessment Breakdown</Text>
            {scoreResult.sections.map((s: any) => ( 
              <Text key={s.label} style={styles.item}> 
              {s.label}: {s.score}/{s.max} — {s.reason} 
              </Text> 
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Recommended Action Plan</Text>
          {scoreResult.checklist.map((item: string, i: number) => {
              const label = CHECKLIST_LABELS[item as keyof typeof CHECKLIST_LABELS] ?? item

              return (
                <Text key={item} style={styles.item}>
                  {i + 1}. {label}
                </Text>
              )
            })}
        </View>
      </Page>
    </Document>
  )
}
