import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '@/theme/tokens';
import { useColumnWidth } from './layout';

type Props = {
  children: ReactNode;
  /** Narrowest a cell may get: the column holds as many cells per row as fit. */
  minCellWidth: number;
  /** Cells per row even when they get narrower than `minCellWidth`. */
  minColumns?: number;
  columnGap?: number;
  rowGap?: number;
};

/**
 * Rows of equal cells, read as a list. The number of columns follows the page's column, so a
 * phone shows two wishes side by side and a computer four (docs/design.md, "Grands écrans").
 */
export function Grid({ children, minCellWidth, minColumns = 1, columnGap = space.md, rowGap = space.md }: Props) {
  const width = useColumnWidth();
  const columns = Math.max(minColumns, Math.floor((width + columnGap) / (minCellWidth + columnGap)));
  const cells = Children.toArray(children);
  const rows = Array.from({ length: Math.ceil(cells.length / columns) }, (_, row) =>
    cells.slice(row * columns, (row + 1) * columns),
  );

  return (
    <View role="list" style={{ gap: rowGap }}>
      {rows.map((row, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: rows are positions, not items
        <View key={index} style={[styles.row, { gap: columnGap }]}>
          {Array.from({ length: columns }, (_, cell) =>
            row[cell] === undefined ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: empty slots keep the last row's cells the same width
              <View key={cell} style={styles.cell} />
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: the cell's content carries its own key
              <View key={cell} role="listitem" style={styles.cell}>
                {row[cell]}
              </View>
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  // Cells shrink below their content's width rather than push the row wider (WCAG 1.4.10).
  cell: { flex: 1, minWidth: 0 },
});
