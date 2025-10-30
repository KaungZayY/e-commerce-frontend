<template>
    <div class="w-full">
        <label v-if="label" class="block mb-1 text-sm text-gray-700">
            {{ label }}
        </label>

        <div class="border border-dashed rounded-lg p-6 text-center transition relative" :class="{
            'cursor-pointer hover:border-gray-500 border-gray-400': !isDragging,
            'border-gray-400 bg-gray-50': isDragging,
        }" @click="triggerInput" @dragover.prevent.stop="onDragOver" @dragleave.prevent.stop="onDragLeave"
            @drop.prevent.stop="onDrop">
            <i class="pi pi-upload text-gray-600 text-2xl"></i>
            <p class="text-sm text-gray-700 mt-2">Click to upload or drag and drop</p>
            <p class="text-xs text-gray-500">{{ acceptedFormatsText }} (Not more than {{ maxSizeText }})</p>
            <input type="file" ref="fileInput" :accept="acceptAttribute" :multiple="mode === 'multiple'" class="hidden"
                @change="onFileSelect" />
        </div>

        <!-- Multiple images preview -->
        <div v-if="mode === 'multiple' && previewUrls.length > 0" class="mt-3 flex flex-wrap gap-2">
            <div v-for="(preview, index) in previewUrls" :key="index" class="relative">
                <img :src="preview" class="h-16 w-16 rounded-lg object-cover" />
                <button type="button" @click.stop="removeImage(index)"
                    class="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full shadow text-white p-0.5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Single image preview -->
        <div v-if="mode === 'single' && previewUrl" class="relative mt-3 flex justify-end">
            <div class="relative">
                <img :src="previewUrl" class="h-16 w-16 rounded-lg object-cover" />
                <button type="button" @click.stop="removeImage()"
                    class="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full shadow text-white p-0.5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>

        <p v-if="error" class="text-xs text-red-500 mt-2">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { uploadByChunk } from '@/composables/FileUploadChunk'

const props = defineProps({
    modelValue: [String, Array],
    label: String,
    mode: {
        type: String,
        default: 'single', // 'single' or 'multiple'
        validator: (value) => ['single', 'multiple'].includes(value)
    },
    dir: {
        type: String,
        default: 'uploads',
    },
    maxSize: {
        type: Number,
        default: 2, // Size in MB
    },
    validTypes: {
        type: Array,
        default: () => ['PNG', 'JPEG', 'WEBP'],
    },
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const previewUrl = ref('') // For single mode
const previewUrls = ref([]) // For multiple mode
const error = ref('')
const isDragging = ref(false)

// Computed properties for display text
const maxSizeInBytes = computed(() => props.maxSize * 1024 * 1024)

// Convert short format (PNG, PDF, etc) to MIME types (image/png, application/pdf, etc)
const mimeTypes = computed(() => {
    return props.validTypes.map(type => {
        // If already a MIME type, return as is
        if (type.includes('/')) {
            return type
        }

        // Convert short format to MIME type
        const upperType = type.toUpperCase()
        switch (upperType) {
            case 'PNG':
                return 'image/png'
            case 'JPG':
            case 'JPEG':
                return 'image/jpeg'
            case 'WEBP':
                return 'image/webp'
            case 'GIF':
                return 'image/gif'
            case 'SVG':
                return 'image/svg+xml'
            case 'PDF':
                return 'application/pdf'
            case 'DOC':
                return 'application/msword'
            case 'DOCX':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            case 'XLS':
                return 'application/vnd.ms-excel'
            case 'XLSX':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            case 'CSV':
                return 'text/csv'
            case 'TXT':
                return 'text/plain'
            case 'ZIP':
                return 'application/zip'
            default:
                return type // Return as is if not recognized
        }
    })
})

const maxSizeText = computed(() => {
    return `${props.maxSize}MB`
})

const acceptedFormatsText = computed(() => {
    return props.validTypes.map(type => {
        // If it's already a MIME type, extract extension
        if (type.includes('/')) {
            const ext = type.split('/')[1].split('+')[0].toUpperCase()
            return ext === 'JPEG' ? 'JPG' : ext
        }
        // Otherwise use the type as is
        return type.toUpperCase() === 'JPEG' ? 'JPG' : type.toUpperCase()
    }).join(', ')
})

const acceptAttribute = computed(() => {
    return mimeTypes.value.join(', ')
})

function triggerInput() {
    fileInput.value?.click()
}

function onFileSelect(e) {
    error.value = ''
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    fileInput.value.value = '' // allow reselecting same file

    if (props.mode === 'single') {
        handleUpload(files[0])
    } else {
        handleMultipleUpload(files)
    }
}

function onDragOver(e) {
    isDragging.value = true
}

function onDragLeave(e) {
    isDragging.value = false
}

function onDrop(e) {
    isDragging.value = false
    error.value = ''
    const files = Array.from(e.dataTransfer?.files || [])
    if (files.length === 0) return

    if (props.mode === 'single') {
        handleUpload(files[0])
    } else {
        handleMultipleUpload(files)
    }
}

async function handleUpload(file) {
    error.value = ''
    // Validate type
    if (!mimeTypes.value.includes(file.type)) {
        const formats = acceptedFormatsText.value
        error.value = `Only ${formats} file types are supported.`
        return
    }
    // Validate size
    if (file.size > maxSizeInBytes.value) {
        error.value = `File size must be less than ${maxSizeText.value}.`
        return
    }

    // Revoke previous preview URL if it's a blob URL
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(file)

    try {
        let result = await uploadByChunk(file, props.dir)
        // Extract path from result object
        const filePath = result?.path || result
        emit('update:modelValue', filePath)
    } catch (err) {
        error.value = 'Upload failed. Please try again.'
        console.error(err)
    }
}

async function handleMultipleUpload(files) {
    error.value = ''
    const validFiles = []

    // Validate all files first
    for (const file of files) {
        if (!mimeTypes.value.includes(file.type)) {
            const formats = acceptedFormatsText.value
            error.value = `Only ${formats} file types are supported.`
            return
        }
        if (file.size > maxSizeInBytes.value) {
            error.value = `File size must be less than ${maxSizeText.value}.`
            return
        }
        validFiles.push(file)
    }

    try {
        // Upload all files
        const uploadPromises = validFiles.map(file => uploadByChunk(file, props.dir))
        const results = await Promise.all(uploadPromises)

        // Extract paths from results (handle both object and string responses)
        const filePaths = results.map(result => result?.path || result)

        // Create preview URLs
        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        previewUrls.value = [...previewUrls.value, ...newPreviews]

        // Emit updated array - append to existing values
        const currentValues = Array.isArray(props.modelValue) ? props.modelValue : []
        emit('update:modelValue', [...currentValues, ...filePaths])
    } catch (err) {
        error.value = 'Upload failed. Please try again.'
        console.error(err)
    }
}

function removeImage(index) {
    if (props.mode === 'single') {
        if (confirm('Are you sure you want to remove this image?')) {
            if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl.value)
            }
            previewUrl.value = ''
            emit('update:modelValue', '')
            fileInput.value.value = ''
        }
    } else {
        if (confirm('Are you sure you want to remove this image?')) {
            // Revoke blob URL
            if (previewUrls.value[index] && previewUrls.value[index].startsWith('blob:')) {
                URL.revokeObjectURL(previewUrls.value[index])
            }

            // Remove from preview array
            previewUrls.value.splice(index, 1)

            // Remove from model value
            const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
            currentValues.splice(index, 1)
            emit('update:modelValue', currentValues)
        }
    }
}

const config = useRuntimeConfig()

// Watch for changes to modelValue
watch(
    () => props.modelValue,
    (val) => {
        if (props.mode === 'single') {
            // Handle single mode
            if (!val || (typeof val === 'string' && val.trim() === '')) {
                previewUrl.value = ''
                return
            }

            // Ensure val is a string
            if (typeof val !== 'string') {
                previewUrl.value = ''
                return
            }

            // Handle blob/http vs stored file
            if (val.startsWith('blob:') || val.startsWith('http')) {
                previewUrl.value = val
            } else {
                previewUrl.value = `${config.public.apiBase}/file/${val}`
            }
        } else {
            // Handle multiple mode
            if (!val || !Array.isArray(val) || val.length === 0) {
                // Clean up old blob URLs
                previewUrls.value.forEach(url => {
                    if (url && url.startsWith('blob:')) {
                        URL.revokeObjectURL(url)
                    }
                })
                previewUrls.value = []
                return
            }

            // Map array values to preview URLs
            previewUrls.value = val.map(item => {
                if (!item || typeof item !== 'string') return ''

                if (item.startsWith('blob:') || item.startsWith('http')) {
                    return item
                } else {
                    return `${config.public.apiBase}/file/${item}`
                }
            }).filter(url => url !== '')
        }
    },
    { immediate: true }
)
</script>