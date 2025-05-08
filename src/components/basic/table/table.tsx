import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import clsx from "clsx";
import styles from './table.module.css'

export type Column<T> = ColumnDef<T>

type TableProps<DataType> = {
    columns: Column<DataType>[],
    data?: DataType[],
    className?: string,
    onRowClick?: (row: DataType) => void
}

const Table = <DataType extends object>({
    columns,
    data = [],
    className,
    onRowClick
}: TableProps<DataType>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        defaultColumn: {
            size: 0
        }
    })

    return (
        <div className={clsx("max-w-full overflow-hidden rounded-lg shadow-sm", styles.tableWrapper, className)}>
            <table className="w-full m-0 table table-auto border-separate text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50/50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{
                                        width: header.column.columnDef.meta?.width ?
                                            header.column.columnDef.meta?.width : 'auto'
                                    }}
                                    className="px-6 py-3 font-medium text-white whitespace-nowrap bg-indigo-400"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className="border-t border-gray-100 transition-colors hover:bg-indigo-50/50 cursor-pointer"
                            onClick={() => onRowClick?.(row.original)}
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    className="pl-6"
                                    key={cell.id}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!data || data.length === 0) && (
                <div className="flex justify-center items-center py-8 text-gray-500 text-sm">
                    暂无数据
                </div>
            )}
        </div>
    )
}

export default Table
