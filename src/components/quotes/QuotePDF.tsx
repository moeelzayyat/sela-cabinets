import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

// Register font if needed (using default for now)

// Colors matching SELA brand
const colors = {
  primary: '#F59E0B', // Amber
  dark: '#1E293B',    // Slate-800
  text: '#334155',    // Slate-700
  light: '#F1F5F9',   // Slate-100
  border: '#E2E8F0',  // Slate-200
  white: '#FFFFFF',
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  logo: {
    width: 150,
    height: 40,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  companyTagline: {
    fontSize: 10,
    color: colors.text,
    marginTop: 2,
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 9,
    color: colors.text,
  },
  quoteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  quoteNumber: {
    fontSize: 12,
    color: colors.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  customerBox: {
    width: '48%',
    padding: 12,
    backgroundColor: colors.light,
    borderRadius: 4,
  },
  customerLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#64748B',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 2,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: {
    backgroundColor: colors.light,
  },
  tableCell: {
    fontSize: 9,
    color: colors.text,
  },
  col1: { width: '8%' },
  col2: { width: '44%' },
  col3: { width: '12%', textAlign: 'right' },
  col4: { width: '12%', textAlign: 'right' },
  col5: { width: '12%', textAlign: 'right' },
  col6: { width: '12%', textAlign: 'right' },
  sectionDivider: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.dark,
    backgroundColor: colors.light,
    padding: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  totalsSection: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 250,
    padding: 6,
  },
  totalsLabel: {
    width: 120,
    fontSize: 10,
    color: colors.text,
  },
  totalsValue: {
    width: 100,
    fontSize: 10,
    textAlign: 'right',
    color: colors.text,
  },
  totalRow: {
    backgroundColor: colors.primary,
    marginTop: 5,
    padding: 10,
    borderRadius: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  depositRow: {
    backgroundColor: colors.light,
    padding: 8,
    marginTop: 5,
    borderRadius: 4,
  },
  termsSection: {
    marginTop: 30,
    padding: 12,
    backgroundColor: colors.light,
    borderRadius: 4,
  },
  termsText: {
    fontSize: 8,
    color: colors.text,
    lineHeight: 1.5,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    marginBottom: 8,
    marginTop: 30,
  },
  signatureLabel: {
    fontSize: 9,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
  },
  statusBadge: {
    position: 'absolute',
    top: 40,
    right: 40,
    padding: '6 12',
    borderRadius: 4,
  },
  statusDraft: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  statusSent: {
    backgroundColor: '#DBEAFE',
    color: '#2563EB',
  },
  statusAccepted: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
  },
})

interface QuoteItem {
  id: number
  section: string
  description: string
  quantity: number
  unit_price: number
  discount_percent: number
  line_total: number
}

interface Quote {
  id: number
  quote_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_percent: number
  discount_amount: number
  total: number
  deposit_amount: number
  deposit_percent: number
  valid_until: string
  terms: string
  status: string
  created_at: string
}

interface QuotePDFProps {
  quote: Quote
  items: QuoteItem[]
}

const sectionLabels: Record<string, string> = {
  cabinets: 'Cabinets',
  hardware: 'Hardware',
  labor: 'Labor',
  countertops: 'Countertops',
  delivery: 'Delivery',
  other: 'Other',
}

export function QuotePDF({ quote, items }: QuotePDFProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Group items by section
  const groupedItems = items.reduce((acc, item) => {
    const section = item.section || 'other'
    if (!acc[section]) acc[section] = []
    acc[section].push(item)
    return acc
  }, {} as Record<string, QuoteItem[]>)

  const sectionOrder = ['cabinets', 'hardware', 'labor', 'countertops', 'delivery', 'other']

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, 
          quote.status === 'accepted' ? styles.statusAccepted :
          quote.status === 'sent' ? styles.statusSent : styles.statusDraft
        ]}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>
            {quote.status}
          </Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>SELA Cabinets</Text>
            <Text style={styles.companyTagline}>Premium Kitchen Cabinets at Wholesale Prices</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>(313) 246-7903</Text>
            <Text>info@selacabinets.com</Text>
            <Text>selacabinets.com</Text>
            <Text>Detroit, MI Metro Area</Text>
          </View>
        </View>

        {/* Quote Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.quoteTitle}>QUOTE</Text>
          <Text style={styles.quoteNumber}>{quote.quote_number}</Text>
          <Text style={{ fontSize: 9, color: colors.text, marginTop: 4 }}>
            Date: {formatDate(quote.created_at)}
            {quote.valid_until && `  •  Valid Until: ${formatDate(quote.valid_until)}`}
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.row}>
          <View style={styles.customerBox}>
            <Text style={styles.customerLabel}>Bill To</Text>
            <Text style={styles.customerName}>{quote.customer_name}</Text>
            {quote.customer_phone && (
              <Text style={styles.customerDetail}>{quote.customer_phone}</Text>
            )}
            {quote.customer_email && (
              <Text style={styles.customerDetail}>{quote.customer_email}</Text>
            )}
            {quote.customer_address && (
              <Text style={styles.customerDetail}>{quote.customer_address}</Text>
            )}
          </View>
          <View style={styles.customerBox}>
            <Text style={styles.customerLabel}>Ship To</Text>
            <Text style={styles.customerName}>{quote.customer_name}</Text>
            {quote.customer_address && (
              <Text style={styles.customerDetail}>{quote.customer_address}</Text>
            )}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Unit Price</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Disc%</Text>
            <Text style={[styles.tableHeaderCell, styles.col6]}>Total</Text>
          </View>

          {sectionOrder.map(section => {
            const sectionItems = groupedItems[section]
            if (!sectionItems || sectionItems.length === 0) return null

            return (
              <View key={section}>
                <Text style={styles.sectionDivider}>{sectionLabels[section] || section}</Text>
                {sectionItems.map((item, index) => (
                  <View 
                    key={item.id} 
                    style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : null]}
                  >
                    <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                    <Text style={[styles.tableCell, styles.col2]}>{item.description}</Text>
                    <Text style={[styles.tableCell, styles.col3]}>{item.quantity}</Text>
                    <Text style={[styles.tableCell, styles.col4]}>{formatCurrency(item.unit_price)}</Text>
                    <Text style={[styles.tableCell, styles.col5]}>{item.discount_percent}%</Text>
                    <Text style={[styles.tableCell, styles.col6]}>{formatCurrency(item.line_total)}</Text>
                  </View>
                ))}
              </View>
            )
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>{formatCurrency(quote.subtotal)}</Text>
          </View>
          {quote.discount_percent > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Discount ({quote.discount_percent}%)</Text>
              <Text style={[styles.totalsValue, { color: '#DC2626' }]}>-{formatCurrency(quote.discount_amount)}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Tax ({quote.tax_rate}%)</Text>
            <Text style={styles.totalsValue}>{formatCurrency(quote.tax_amount)}</Text>
          </View>
          <View style={[styles.totalsRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.total)}</Text>
          </View>
          <View style={[styles.totalsRow, styles.depositRow]}>
            <Text style={[styles.totalsLabel, { fontWeight: 'bold' }]}>
              Deposit Required ({quote.deposit_percent}%)
            </Text>
            <Text style={[styles.totalsValue, { fontWeight: 'bold', color: '#059669' }]}>
              {formatCurrency(quote.deposit_amount)}
            </Text>
          </View>
        </View>

        {/* Terms */}
        {quote.terms && (
          <View style={styles.termsSection}>
            <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Terms & Conditions</Text>
            <Text style={styles.termsText}>{quote.terms}</Text>
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Customer Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing SELA Cabinets! • (313) 246-7903 • selacabinets.com
          </Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>
            10x10 Kitchens from $3,999 Installed • Save up to 66% vs Big Box Stores
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default QuotePDF
