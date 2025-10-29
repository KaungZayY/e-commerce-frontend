<template>
    <div class="w-full space-y-4">
        <!-- Header with Column Selection -->
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <div class="relative" ref="column_selector">
                    <button @click="showColumnSelector = !showColumnSelector"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-custom-gray focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Columns
                    </button>

                    <!-- Column Selector Dropdown -->
                    <div v-if="showColumnSelector"
                        class="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <div class="px-4 py-3 border-b border-gray-200">
                            <p class="text-sm font-medium text-gray-900">Toggle columns</p>
                        </div>
                        <div class="py-1">
                            <label v-for="column in columns" :key="column.accessorKey"
                                class="flex items-center px-4 py-2 hover:bg-custom-gray cursor-pointer">
                                <input type="checkbox" :checked="visibleColumns.includes(column.accessorKey)"
                                    @change="toggleColumn(column.accessorKey)"
                                    class="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <span class="text-sm text-gray-700">{{ column.header }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="">
                    <slot>
                        <!-- Search Box Here -->
                    </slot>
                </div>
            </div>
            <div class="flex gap-2">
                 <LoadingBtn v-if="showAddBtn" :label="props.addBtnLabel" type="button" @click="emit('add')" />
            </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white shadow rounded-lg ">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-custom-gray">
                    <tr>
                        <th v-if="viewMode === 'card'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10"></th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            No
                        </th>
                        <th v-for="column in filteredColumns" :key="column.accessorKey"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            {{ column.header }}
                        </th>
                        <th v-if="showActionBtns" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <template v-for="(row, index) in data" :key="row.id">
                        <tr class="hover:bg-custom-gray">
                            <td v-if="viewMode === 'card'" class="px-6 py-4 whitespace-nowrap text-left">
                                <div class="flex items-center">
                                    <button @click.stop="toggleRowExpand(row.id)"
                                        class="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        :title="isRowVisible(row.id) ? 'Collapse' : 'Expand'">
                                        <svg v-if="!isRowVisible(row.id)" class="h-5 w-5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M20 12H4" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                            <td>
                                <div class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap text-right">
                                    {{ index + 1 + (props.currentPage - 1) * internalPageSize }}
                                </div>
                            </td>
                            <td v-for="column in filteredColumns" :key="column.accessorKey"
                                class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                <component v-if="column.cell" :is="column.cell" :value="row[column.accessorKey]"
                                    :row="row" @detail="handleView(row)" :file_storage="column.file_storage"/>
                                <span v-else>{{ row[column.accessorKey] }}</span>
                            </td>
                            <td v-if="showActionBtns" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click.stop="toggleActionMenu(row.id, $event)"
                                        class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
                                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>

                                    <!-- Action Menu -->
                                    <teleport to="body">
                                        <div v-if="activeActionMenu === row.id" :style="getMenuTeleportStyle(row.id)"
                                            class="absolute w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 action-menu">
                                            <div class="py-1">
                                                <button v-if="enqVerify && row.enquiry_status != 'Verified'"
                                                    @click="enquiryVerify(row)"
                                                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-custom-gray">
                                                    <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Verify Student
                                                </button>
                                                <button v-if="enqVerify && row.enquiry_status == 'Verified'"
                                                    @click="assignTo(row)"
                                                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-custom-gray">
                                                    <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Assign to
                                                </button>
                                                <button @click="handleView(row)" v-if="!enqVerify && view"
                                                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-custom-gray">
                                                    <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View
                                                </button>
                                                <button @click="handleEdit(row)"
                                                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-custom-gray">
                                                    <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Modify
                                                </button>
                                                <hr class="my-1 border-gray-200" />
                                                <button @click="handleDelete(row)"
                                                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </teleport>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="isRowVisible(row.id)">
                            <td :colspan="filteredColumns.length + 2" class="p-0">
                                <slot name="card" :row="row" class="w-full">
                                    <!-- Card view content can be placed here -->
                                </slot>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">Showing</span>
                <select v-model.number="internalPageSize" @change="onPageSizeChange"
                    class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option v-for="size in pageSizeOptions" :key="size" :value="size">
                        {{ size }}
                    </option>
                </select>
                <span class="text-sm text-gray-700">of {{ totalItems }} results</span>
            </div>

            <div class="flex items-center space-x-2">
                <button @click="goToFirstPage" :disabled="currentPage === 1"
                    class="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>

                <button @click="goToPreviousPage" :disabled="currentPage === 1"
                    class="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <span class="text-sm text-gray-700">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>

                <button @click="goToNextPage" :disabled="currentPage === totalPages"
                    class="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <button @click="goToLastPage" :disabled="currentPage === totalPages"
                    class="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, required: true },
    pageSizeOptions: { type: Array, default: () => [10, 20, 50, 100] },
    pageSize: { type: Number, default: 10 },
    currentPage: { type: Number, default: 1 },
    totalItems: { type: Number, required: true },
    onPageChange: Function,
    onPageSizeChange: Function,
    addBtnLabel: { type: String, required: false },
    showAddBtn: { type: Boolean, default: true },
    viewMode: { type: String, default: 'table' },
    enqVerify: { type: Boolean, default: false },
    view: { type: Boolean, default: true },
    showActionBtns: { type: Boolean, default: true },
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'view', 'edit', 'delete', 'add', 'export', 'verify', 'assign'])

// Reactive state
const visibleColumns = ref(props.columns.map(c => c.accessorKey))
const viewMode = ref(props.viewMode)
// Independent expand/collapse state (defaults hidden)
const isExpandedAll = ref(false)
const expandedRowIds = ref(new Set()) // used when global OFF
const collapsedRowIds = ref(new Set()) // used when global ON
const expandAllLabel = computed(() => (isExpandedAll.value ? 'Collapse all' : 'Expand all'))
const showColumnSelector = ref(false)
const activeActionMenu = ref(null)
const menuPositions = ref({}) // track menu positions
const column_selector = ref(null);

onClickOutside(column_selector, () => {
    showColumnSelector.value = false;
})

// Internal page size controlled with model
const internalPageSize = ref(props.pageSize)

// Computed filtered columns based on visibility
const filteredColumns = computed(() =>
    props.columns.filter(col => visibleColumns.value.includes(col.accessorKey))
)

const totalPages = computed(() =>
    Math.ceil(props.totalItems / internalPageSize.value)
)

// Toggle column visibility
function toggleColumn(key) {
    if (visibleColumns.value.includes(key)) {
        visibleColumns.value = visibleColumns.value.filter(k => k !== key)
    } else {
        visibleColumns.value.push(key)
    }
}

// Helpers to get cell component if exists
function getCellComponent(column, row) {
    return column.cell ? column.cell : null
}

// Action handlers - now emit events to parent
function handleView(row) {
    emit('view', row)
    closeActionMenu()
}

function handleEdit(row) {
    emit('edit', row)
    closeActionMenu()
}

function handleDelete(row) {
    emit('delete', row)
    closeActionMenu()
}

function closeActionMenu() {
    activeActionMenu.value = null
    menuPositions.value = {}
}

function enquiryVerify(row) {
    emit('verify', row)
    closeActionMenu()
}

function assignTo(row) {
    emit('assign', row)
    closeActionMenu()
}

// Click outside to close menu
document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-menu') && !e.target.closest('button')) {
        closeActionMenu()
    }
})

// Toggle action menu with intelligent positioning
function toggleActionMenu(rowId, event) {
    if (activeActionMenu.value === rowId) {
        closeActionMenu()
    } else {
        activeActionMenu.value = rowId
        nextTick(() => {
            calculateMenuPosition(rowId, event.target)
        })
    }
}

function calculateMenuPosition(rowId, buttonElement) {
    if (!buttonElement) return

    const rect = buttonElement.getBoundingClientRect()
    const menuWidth = 192
    const menuHeight = 140
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    let top = rect.bottom
    let left = rect.left

    // Adjust vertically if bottom overflows
    if (rect.bottom + menuHeight > viewportHeight) {
        top = rect.top - menuHeight
    }

    // Adjust horizontally if right overflows
    if (rect.left + menuWidth > viewportWidth) {
        left = rect.right - menuWidth
    }

    menuPositions.value[rowId] = {
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`
    }
}

function getMenuTeleportStyle(rowId) {
    const pos = menuPositions.value[rowId]
    return pos
        ? {
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            zIndex: 9999
        }
        : {}
}

function getMenuStyle(rowId) {
    const position = menuPositions.value[rowId]
    if (!position) return {}

    return {
        top: position.top,
        bottom: position.bottom,
        right: position.right,
        left: position.left
    }
}

// Expand/Collapse all rows to show/hide the card slot
function toggleExpandAll() {
    isExpandedAll.value = !isExpandedAll.value
    // Absolute behavior: when collapsing all, clear all individual expansions
    // When expanding all, individual states are irrelevant, so also clear for consistency
    expandedRowIds.value = new Set()
    collapsedRowIds.value = new Set()
}

function toggleRowExpand(rowId) {
    if (isExpandedAll.value) {
        // When globally expanded, track per-row collapsed overrides
        if (collapsedRowIds.value.has(rowId)) {
            collapsedRowIds.value.delete(rowId)
            collapsedRowIds.value = new Set(collapsedRowIds.value)
        } else {
            collapsedRowIds.value.add(rowId)
            collapsedRowIds.value = new Set(collapsedRowIds.value)
        }
    } else {
        // When globally collapsed, track per-row expanded overrides
        if (expandedRowIds.value.has(rowId)) {
            expandedRowIds.value.delete(rowId)
            expandedRowIds.value = new Set(expandedRowIds.value)
        } else {
            expandedRowIds.value.add(rowId)
            expandedRowIds.value = new Set(expandedRowIds.value)
        }
    }
}

function isRowExpanded(rowId) {
    return expandedRowIds.value.has(rowId)
}

function isRowVisible(rowId) {
    return isExpandedAll.value ? !collapsedRowIds.value.has(rowId) : expandedRowIds.value.has(rowId)
}

// Pagination controls
function goToFirstPage() {
    if (props.onPageChange) props.onPageChange(1)
    emit('update:currentPage', 1)
}

function goToPreviousPage() {
    if (props.currentPage > 1) {
        const page = props.currentPage - 1
        if (props.onPageChange) props.onPageChange(page)
        emit('update:currentPage', page)
    }
}

function goToNextPage() {
    if (props.currentPage < totalPages.value) {
        const page = props.currentPage + 1
        if (props.onPageChange) props.onPageChange(page)
        emit('update:currentPage', page)
    }
}

function goToLastPage() {
    if (props.onPageChange) props.onPageChange(totalPages.value)
    emit('update:currentPage', totalPages.value)
}

function onPageSizeChange() {
    if (props.onPageSizeChange) props.onPageSizeChange(internalPageSize.value)
    emit('update:pageSize', internalPageSize.value)
}
</script>

<style scoped>
.action-menu {
    position: absolute;
}
</style>